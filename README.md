# 🎬 Movie Recommendation System

A **content-based movie recommendation system** that recommends movies similar to a movie selected by the user.

The project uses **TF-IDF vectorization and Cosine Similarity** to identify movies with similar characteristics. It is connected to a **FastAPI backend** and a **React frontend**, with movie posters retrieved using the **TMDB API**.

---

## 📌 Project Overview

The Movie Recommendation System allows users to:

* Search for a movie.
* Select a movie from the available dataset.
* Get a list of similar/recommended movies.
* View movie ratings.
* View recommendation similarity scores.
* Display movie posters.
* Interact with the recommendation system through a web interface.

The recommendation engine is based on **content similarity**, meaning recommendations are generated according to information associated with the selected movie rather than relying on other users' preferences.

---

# 🚀 Features

### 🎥 Movie Recommendations

Enter or select a movie and receive a list of movies that are most similar to it.

### 🧠 Content-Based Filtering

The system uses:

* TF-IDF Vectorization
* Cosine Similarity

to calculate similarity between movies.

### ⭐ Movie Ratings

Recommended movies can display their corresponding ratings from the dataset.

### 🖼️ Movie Posters

Movie posters are fetched using the **TMDB API**.

Poster URLs follow the TMDB image format:

```text
https://image.tmdb.org/t/p/w500/<poster_path>
```

### ⚡ FastAPI Backend

The recommendation model is exposed through REST API endpoints using FastAPI.

### ⚛️ React Frontend

The frontend provides an interactive user interface for searching movies and displaying recommendations.

### 🔄 Pre-trained Model

The recommendation model is generated beforehand and stored using Python pickle files, so the model does not need to be trained every time the backend starts.

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │                     │
                    │  Movie Search UI    │
                    └──────────┬──────────┘
                               │
                               │ HTTP Request
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    │                     │
                    │  Recommendation API │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Recommendation      │
                    │ Engine              │
                    │                     │
                    │ TF-IDF              │
                    │ Cosine Similarity   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Pre-trained Model   │
                    │                     │
                    │ .pkl files          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Movie Dataset       │
                    │                     │
                    │ Titles              │
                    │ Ratings             │
                    │ Metadata            │
                    └─────────────────────┘

                         +
                         
                    ┌─────────────────────┐
                    │      TMDB API       │
                    │                     │
                    │   Movie Posters     │
                    └─────────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React
* JavaScript
* HTML
* CSS
* Vite

## Backend

* Python
* FastAPI
* Uvicorn

## Machine Learning

* Pandas
* NumPy
* Scikit-learn
* TF-IDF
* Cosine Similarity

## External API

* TMDB API

## Model Storage

* Pickle

## Development Tools

* Jupyter Notebook
* VS Code
* Git
* GitHub

---

# 🧠 Recommendation Method

The project uses **Content-Based Filtering**.

The basic process is:

```text
Movie Dataset
     ↓
Data Cleaning
     ↓
Feature Selection
     ↓
Text Feature Combination
     ↓
TF-IDF Vectorization
     ↓
Cosine Similarity
     ↓
Similarity Matrix
     ↓
Top Similar Movies
```

---

## 1. Data Preparation

The movie dataset contains information such as:

* Movie title
* Genres
* Keywords
* Cast
* Director
* Overview
* Rating

Relevant textual information is combined into a single feature representation.

Example:

```text
Action Adventure Sci-Fi
Leonardo DiCaprio
Christopher Nolan
Dream manipulation science fiction
```

This combined information is used by the recommendation model.

---

# 2. TF-IDF Vectorization

TF-IDF stands for:

**Term Frequency – Inverse Document Frequency**

It converts textual movie information into numerical vectors.

The basic idea is:

* Words that appear frequently in a movie's description become important.
* Words that appear in almost every movie receive less importance.
* Each movie gets represented as a numerical vector.

The project uses Scikit-learn's TF-IDF vectorizer.

---

# 3. Cosine Similarity

After converting movies into numerical vectors, the system calculates the similarity between movies using **Cosine Similarity**.

The similarity value is generally between:

```text
0 → Completely different
1 → Highly similar
```

A higher cosine similarity means the movies have more similar content according to the features used by the model.

For example:

```json
{
    "movie": "Inception",
    "recommendations": [
        {
            "title": "Cypher",
            "score": 0.2330,
            "rating": 6.4
        }
    ]
}
```

The `score` represents the similarity calculated by the recommendation system.

---

# 💾 Model Files

After training/processing the recommendation model, the required objects are stored as pickle files.

Typical files include:

```text
df.pkl
tfidf.pkl
tfidf_matrix.pkl
indices.pkl
```

### `df.pkl`

Stores the processed movie DataFrame.

It can contain information such as:

* Movie title
* Rating
* Genres
* Metadata
* Poster path

---

### `tfidf.pkl`

Stores the trained TF-IDF vectorizer.

It allows the backend to use the same vectorization process that was used while generating the model.

---

### `tfidf_matrix.pkl`

Stores the TF-IDF representation of the movie dataset.

This prevents the backend from having to regenerate the vectors every time.

---

### `indices.pkl`

Stores the mapping between movie titles and their corresponding DataFrame indices.

This makes it easier to find a movie quickly when a user searches for it.

---

# 🖼️ Poster Integration

Movie posters are obtained using **TMDB**.

The dataset contains a poster path such as:

```text
/nLvUdqgPgm3F85NMCii9gVFUcet.jpg
```

The frontend/backend can convert it into a complete image URL:

```text
https://image.tmdb.org/t/p/w500/nLvUdqgPgm3F85NMCii9gVFUcet.jpg
```

Some movies may not have a poster path.

Therefore, the application should handle missing posters gracefully instead of allowing a missing poster to break the recommendation page.

Example:

```text
Poster available
        ↓
Display TMDB poster

Poster unavailable
        ↓
Display fallback image
```

---

# 🌐 TMDB API

The project uses TMDB to obtain movie poster information.

The API key/token should **never be hardcoded directly into the source code**.

Use an environment variable such as:

```text
TMDB_API_KEY=your_api_key_here
```

or, if using a bearer token:

```text
TMDB_BEARER_TOKEN=your_token_here
```

The `.env` file should not be pushed to GitHub.

Add it to:

```text
.gitignore
```

Example:

```text
.env
```

---

# 📁 Project Structure

The exact structure can vary depending on the local setup, but the project is organized approximately like this:

```text
Movie-Recommendation-System/
│
├── Backend/
│   ├── main.py
│   ├── df.pkl
│   ├── tfidf.pkl
│   ├── tfidf_matrix.pkl
│   ├── indices.pkl
│   ├── .env
│   └── ...
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── ...
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── Notebook/
│   ├── recommendation.ipynb
│   └── ...
│
├── dataset/
│   └── movies.csv
│
├── .gitignore
└── README.md
```

> The names of folders/files can be changed according to the actual repository structure.

---

# ⚙️ Installation

## Prerequisites

Make sure the following are installed:

* Python 3.9+
* Node.js
* npm
* Git

---

# 🔧 Backend Setup

Open a terminal and navigate to the backend folder:

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

If a `requirements.txt` file is not available, install the main dependencies:

```bash
pip install fastapi uvicorn pandas numpy scikit-learn python-dotenv requests
```

---

# 🔐 Environment Variables

Create a `.env` file inside the backend directory:

```text
TMDB_BEARER_TOKEN=your_tmdb_bearer_token
```

Use the variable name expected by your backend code.

**Do not upload your actual token to GitHub.**

---

# ▶️ Running the Backend

From the backend directory:

```bash
uvicorn main:app --reload
```

The backend will normally run at:

```text
http://127.0.0.1:8000
```

FastAPI also provides automatic API documentation.

Open:

```text
http://127.0.0.1:8000/docs
```

to view and test the API using Swagger UI.

---

# ⚛️ Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd Frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔗 Connecting Frontend and Backend

The React frontend sends a request to the FastAPI backend.

Example flow:

```text
User searches:
"Inception"
        ↓
React frontend
        ↓
FastAPI endpoint
        ↓
Movie title lookup
        ↓
Similarity calculation
        ↓
Top recommendations
        ↓
JSON response
        ↓
React displays movie cards
```

---

# 📡 API

The backend exposes an endpoint for getting movie recommendations.

Example request:

```text
GET /recommend/{movie_name}
```

For example:

```text
GET /recommend/Inception
```

The exact endpoint may vary depending on the implementation in `Backend/main.py`.

---

# 📤 Example API Response

Example:

```json
{
    "movie": "Inception",
    "recommendations": [
        {
            "title": "Cypher",
            "score": 0.2330611191954194,
            "rating": 6.4
        },
        {
            "title": "The Matrix",
            "score": 0.2198,
            "rating": 7.6
        }
    ]
}
```

The response can also contain poster information:

```json
{
    "title": "The Matrix",
    "score": 0.2198,
    "rating": 7.6,
    "poster": "https://image.tmdb.org/t/p/w500/example.jpg"
}
```

---

# 🔄 Model Generation

The recommendation model is created in the Jupyter Notebook.

The general workflow is:

```text
Load Dataset
     ↓
Clean Dataset
     ↓
Handle Missing Values
     ↓
Combine Relevant Features
     ↓
TF-IDF Vectorization
     ↓
Calculate Similarity
     ↓
Create Movie Index
     ↓
Save Model Files
```

The generated pickle files are then loaded by the FastAPI backend.

---

# 📊 Recommendation Score

The recommendation score is based on cosine similarity.

A simplified interpretation:

|       Score | Interpretation       |
| ----------: | -------------------- |
| 0.00 – 0.10 | Very low similarity  |
| 0.10 – 0.20 | Low similarity       |
| 0.20 – 0.30 | Moderate similarity  |
| 0.30 – 0.50 | Good similarity      |
|       0.50+ | Very high similarity |

These ranges are **not universal quality thresholds**. They depend heavily on the dataset and the features used to build the TF-IDF vectors.

The system should therefore rank movies primarily by their relative similarity rather than assuming that a particular score always represents a specific quality level.

---

# 🧩 Handling Missing Poster Data

Not every movie in the dataset has a matching TMDB poster.

For example:

```text
Movie A → Poster available
Movie B → Poster available
Movie C → null
Movie D → Poster available
```

The application should not fail when a poster is unavailable.

Instead, it can use:

```text
Movie C
   ↓
Poster unavailable
   ↓
Fallback image / placeholder
```

This allows the recommendation system to continue working even when poster metadata is incomplete.

---

# 🐛 Common Issues

## Backend not connecting

Make sure FastAPI is running:

```bash
uvicorn main:app --reload
```

Check:

```text
http://127.0.0.1:8000/docs
```

If Swagger opens, the backend is running.

---

## Frontend cannot connect to backend

Check that:

1. FastAPI is running.
2. The frontend is using the correct backend URL.
3. The API endpoint is correct.
4. CORS is configured correctly.

Example FastAPI CORS configuration:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

For production, replace `*` with the actual frontend domain.

---

# ❌ Movie Not Found

If a user enters a movie that does not exist in the dataset, the backend should return an appropriate response rather than crashing.

Example:

```json
{
    "error": "Movie not found"
}
```

The frontend can then display:

```text
Movie not found. Please try another movie.
```

---

# 🔑 TMDB Token Issues

If posters are not loading:

Check:

* `.env` exists.
* The token is correct.
* The backend is loading environment variables.
* The TMDB request is successful.
* The poster path is not `null`.

Never expose your TMDB token in frontend source code or GitHub.

---

# 🔒 Security

The following files should generally not be committed:

```text
.env
venv/
__pycache__/
*.pyc
node_modules/
```

Example `.gitignore`:

```text
# Python
venv/
__pycache__/
*.pyc

# Environment variables
.env

# Node
node_modules/

# Build
dist/

# Jupyter
.ipynb_checkpoints/
```

---

# 🧪 Testing

The backend can be tested using:

* FastAPI Swagger UI
* Browser
* Postman
* Frontend application

Swagger:

```text
http://127.0.0.1:8000/docs
```

Test cases should include:

### Valid movie

```text
Inception
```

Expected:

```text
List of recommended movies
```

### Invalid movie

```text
abcdef12345
```

Expected:

```text
Movie not found
```

### Movie with missing poster

Expected:

```text
Recommendation works
+
Fallback poster is displayed
```

---

# 🚀 Future Improvements

The current system can be extended with:

### 👤 User Personalization

Allow users to create accounts and maintain:

* Watch history
* Favorites
* Ratings
* Recently viewed movies

### ⭐ Hybrid Recommendation

Combine:

```text
Content-Based Filtering
        +
Collaborative Filtering
```

to improve recommendation quality.

### 🎭 Advanced Movie Filters

Allow users to filter recommendations by:

* Genre
* Rating
* Release year
* Language
* Popularity

### 🔍 Better Search

Add:

* Autocomplete
* Fuzzy search
* Search suggestions
* Movie title correction

### 📈 Recommendation Analytics

Track:

* Most searched movies
* Most recommended movies
* Popular genres
* User interactions

### 🤖 AI-Based Recommendations

Future versions could use:

* Sentence Transformers
* Embeddings
* Semantic search
* Vector databases
* Large Language Models

to generate more semantically meaningful recommendations.

---

# 🗺️ Future Architecture

A more advanced version could look like:

```text
                 React Frontend
                       │
                       ▼
                 FastAPI Backend
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
     Recommendation   User       Movie
        Engine       System      Service
          │
          ▼
      Vector Search
          │
          ▼
    Movie Embeddings
          │
          ▼
    Vector Database
```

---

# 📦 Deployment

The project can eventually be deployed using:

### Frontend

* Vercel
* Netlify

### Backend

* Render
* Railway
* AWS
* Azure
* Google Cloud

### Database

For future user-related features:

* PostgreSQL
* MySQL

---

# 🧑‍💻 Git Workflow

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project:

```bash
cd Movie-Recommendation-System
```

Create a new branch:

```bash
git checkout -b feature-name
```

After making changes:

```bash
git add .
```

Commit:

```bash
git commit -m "Update movie recommendation system"
```

Push:

```bash
git push origin feature-name
```

---

# 📋 Project Workflow Summary

```text
                 MOVIE DATASET
                       │
                       ▼
              Data Preprocessing
                       │
                       ▼
              Feature Engineering
                       │
                       ▼
                 TF-IDF Model
                       │
                       ▼
              Cosine Similarity
                       │
                       ▼
               Save Model Files
                       │
                       ▼
                FastAPI Backend
                       │
                       ▼
                React Frontend
                       │
                       ▼
             User Selects Movie
                       │
                       ▼
             Recommended Movies
                       │
                       ▼
               Movie Posters
                       │
                       ▼
                  TMDB API
```

---

# 🎯 Project Goals

The main goals of this project are:

* Build a practical Machine Learning recommendation system.
* Understand content-based recommendation.
* Implement TF-IDF vectorization.
* Understand cosine similarity.
* Deploy the ML model through FastAPI.
* Build an interactive React frontend.
* Integrate an external movie API.
* Handle missing data and API failures.
* Build a complete end-to-end ML application.

---

# 👨‍💻 Author

**Kothuri Sai Teja**

Electronics and Communication Engineering
NIT Durgapur

GitHub:

```text
https://github.com/kothurisaiteja
```

---

# ⭐ If You Like This Project

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.

---

# 📄 License

This project is intended for educational and personal project purposes.

Movie metadata and poster images are provided through the respective data/API sources and are subject to their terms and licenses.
