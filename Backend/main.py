import os
import re
import pickle
from pathlib import Path
from functools import lru_cache

import pandas as pd
import requests
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sklearn.metrics.pairwise import cosine_similarity


# =========================================================
# APP
# =========================================================

app = FastAPI(title="Movie Recommendation API")


# =========================================================
# ENVIRONMENT
# =========================================================

load_dotenv()

TMDB_ACCESS_TOKEN = os.getenv("TMDB_ACCESS_TOKEN")

print("TMDB token loaded:", TMDB_ACCESS_TOKEN is not None)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # Add your Vercel URL here after deployment
        # "https://your-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# MODEL PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent

# Current structure:
#
# Movie Recommendation/
# │
# ├── Backend/
# │   └── main.py
# │
# └── Notebook/
#     ├── df.pkl
#     ├── indices.pkl
#     ├── tfidf.pkl
#     └── tfidf_matrix.pkl
#
# Therefore:
PROJECT_DIR = BASE_DIR.parent
MODEL_DIR = PROJECT_DIR / "Notebook"


# =========================================================
# LOAD ML FILES
# =========================================================

with open(MODEL_DIR / "tfidf_matrix.pkl", "rb") as file:
    tfidf_matrix = pickle.load(file)

with open(MODEL_DIR / "indices.pkl", "rb") as file:
    indices = pickle.load(file)

with open(MODEL_DIR / "tfidf.pkl", "rb") as file:
    tfidf = pickle.load(file)

df = pd.read_pickle(MODEL_DIR / "df.pkl")


print("Model loaded successfully")
print("DataFrame rows:", len(df))
print("TF-IDF matrix rows:", tfidf_matrix.shape[0])
print("Number of movie indices:", len(indices))


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "Movie Recommendation API is running"
    }


# =========================================================
# ALL MOVIES
# =========================================================

@app.get("/movie")
def get_movies():

    movies = (
        df["title"]
        .dropna()
        .astype(str)
        .unique()
        .tolist()
    )

    return movies


# =========================================================
# NORMALIZE MOVIE TITLE
# =========================================================

def normalize_title(title):
    """
    Makes movie search independent of:
    - uppercase/lowercase
    - spaces
    - hyphens
    - special characters

    Example:

    Spider-Man
    spider man
    SPIDER MAN
    spider-man

    all become:

    spiderman
    """

    title = str(title)

    return re.sub(
        r"[^a-z0-9]",
        "",
        title.lower()
    )


# =========================================================
# TMDB POSTER
# =========================================================

@lru_cache(maxsize=1000)
def get_tmdb_poster(title):

    if not TMDB_ACCESS_TOKEN:
        return None

    url = "https://api.themoviedb.org/3/search/movie"

    headers = {
        "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}",
        "accept": "application/json"
    }

    params = {
        "query": title
    }

    try:

        response = requests.get(
            url,
            headers=headers,
            params=params,
            timeout=10
        )

    except requests.RequestException:
        return None

    if response.status_code != 200:
        return None

    results = response.json().get(
        "results",
        []
    )

    if not results:
        return None

    for result in results:

        poster_path = result.get(
            "poster_path"
        )

        if poster_path:

            return (
                "https://image.tmdb.org/t/p/w500"
                + poster_path
            )

    return None


# =========================================================
# RECOMMENDATIONS
# =========================================================

@app.get("/recommend/{movie}")
def recommend(movie: str):

    # ---------------------------------------------
    # Normalize user input
    # ---------------------------------------------

    normalized_movie = normalize_title(movie)

    matched_movie = None

    # ---------------------------------------------
    # Find actual movie title
    # ---------------------------------------------

    for title in indices.keys():

        if not isinstance(title, str):
            continue

        if normalize_title(title) == normalized_movie:

            matched_movie = title
            break

    # ---------------------------------------------
    # Movie not found
    # ---------------------------------------------

    if matched_movie is None:

        return {
            "error": "Movie not found"
        }

    movie = matched_movie

    # ---------------------------------------------
    # Get movie index
    # ---------------------------------------------

    index = indices[movie]

    # Safety check
    if index >= tfidf_matrix.shape[0]:

        return {
            "error": "Movie index is invalid"
        }

    # ---------------------------------------------
    # Calculate cosine similarity
    # ---------------------------------------------

    distances = cosine_similarity(
        tfidf_matrix[index],
        tfidf_matrix
    ).flatten()

    # ---------------------------------------------
    # Sort movies by similarity
    # ---------------------------------------------

    movies = sorted(
        enumerate(distances),
        key=lambda x: x[1],
        reverse=True
    )

    # Remove selected movie
    movies = [
        item
        for item in movies
        if item[0] != index
    ]

    # Take top 10
    movies = movies[:10]

    # ---------------------------------------------
    # Selected movie poster
    # ---------------------------------------------

    selected_movie_poster = get_tmdb_poster(
        movie
    )

    recommendations = []

    # ---------------------------------------------
    # Build recommendations
    # ---------------------------------------------

    for i, score in movies:

        # Prevent df.iloc out-of-bounds
        if i >= len(df):
            continue

        row = df.iloc[i]

        title = str(
            row["title"]
        )

        # Rating
        rating = row.get(
            "vote_average",
            0
        )

        if pd.isna(rating):
            rating = 0

        # Poster
        poster_url = get_tmdb_poster(
            title
        )

        recommendations.append({

            "title": title,

            # Original cosine similarity
            # 0 -> 1 approximately
            "score": float(2*score),

            "rating": float(rating),

            "poster": poster_url
        })

    # ---------------------------------------------
    # Final response
    # ---------------------------------------------

    return {

        "movie": movie,

        "movie_poster": selected_movie_poster,

        "recommendations": recommendations
    }


# =========================================================
# POPULAR MOVIES
# =========================================================

@app.get("/popular")
def popular_movies():

    if not TMDB_ACCESS_TOKEN:

        return {
            "movies": []
        }

    url = (
        "https://api.themoviedb.org/3/movie/popular"
    )

    headers = {
        "Authorization": f"Bearer {TMDB_ACCESS_TOKEN}",
        "accept": "application/json"
    }

    params = {
        "language": "en-US",
        "page": 1
    }

    try:

        response = requests.get(
            url,
            headers=headers,
            params=params,
            timeout=10
        )

    except requests.RequestException:

        return {
            "movies": []
        }

    if response.status_code != 200:

        return {
            "movies": []
        }

    results = response.json().get(
        "results",
        []
    )

    movies = []

    for movie in results[:10]:

        poster_path = movie.get(
            "poster_path"
        )

        # Only include movies having posters
        if not poster_path:
            continue

        rating = movie.get(
            "vote_average",
            0
        )

        movies.append({

            "title": movie.get(
                "title",
                "Unknown"
            ),

            "poster":
                "https://image.tmdb.org/t/p/w500"
                + poster_path,

            "rating": float(rating)
        })

    return {
        "movies": movies
    }

print("DataFrame shape:", df.shape)
print("DataFrame rows:", df.shape[0])
print("DataFrame columns:", df.shape[1])

print("TF-IDF matrix shape:", tfidf_matrix.shape)
print("TF-IDF rows:", tfidf_matrix.shape[0])
print("TF-IDF columns:", tfidf_matrix.shape[1])