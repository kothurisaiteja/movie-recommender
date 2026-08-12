import { useState, useEffect } from "react";
import "./App.css";
const API_URL = "https://movie-recommender-1-p15a.onrender.com";
function App() {
    const [movie, setMovie] = useState("");
    const [moviePoster, setMoviePoster] = useState(null);
    const [popularMovies, setPopularMovies] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =========================
    // LOAD POPULAR MOVIES
    // =========================
    useEffect(() => {
        fetch(`${API_URL}/popular`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to load popular movies");
                }

                return response.json();
            })
            .then((data) => {
                setPopularMovies(data.movies || []);
            })
            .catch((error) => {
                console.error("Unable to load popular movies:", error);
            });
    }, []);

    // =========================
    // GET RECOMMENDATIONS
    // =========================
    const getRecommendations = async () => {
        if (!movie.trim()) {
            setError("Please enter a movie name.");
            return;
        }

        setLoading(true);
        setError("");
        setRecommendations([]);
        setMoviePoster(null);

        try {
            const response = await fetch(`${API_URL}/recommend/${encodeURIComponent(movie.trim())}`);

            const data = await response.json();

            if (!response.ok || data.error) {
                setError(data.error || "Something went wrong.");
                return;
            }

            // Use the matched movie name returned by backend
            setMovie(data.movie);

            setRecommendations(data.recommendations || []);
            setMoviePoster(data.movie_poster || null);
        } catch (error) {
            console.error("Recommendation error:", error);
            setError("Unable to connect to the backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">

            {/* =========================
                NAVBAR
            ========================= */}
            <nav className="navbar">

                <div className="logo">
                    <span>🎬</span>

                    <h2>
                        Movie<span>Recommender</span>
                    </h2>
                </div>

                <div className="nav-links">
                    <a href="#">Home</a>
                    <a href="#">About</a>
                </div>

            </nav>

            {/* =========================
                MAIN
            ========================= */}
            <main className="container">

                {/* =========================
                    HERO
                ========================= */}
                <section className="hero">

                    <div className="badge">
                        ✨ AI-Powered Movie Recommendations
                    </div>

                    <h1>
                        Find Your Next
                        <span>Favorite Movie</span>
                    </h1>

                    <p>
                        Discover movies similar to the ones you already love,
                        powered by intelligent content-based recommendations.
                    </p>

                    {/* SEARCH */}
                    <div className="search-box">

                        <div className="input-wrapper">

                            <span>🔍</span>

                            <input
                                type="text"
                                placeholder="Search for a movie..."
                                value={movie}
                                onChange={(e) => {
                                    setMovie(e.target.value);
                                    setError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        getRecommendations();
                                    }
                                }}
                            />

                        </div>

                        <button
                            onClick={getRecommendations}
                            disabled={loading}
                        >
                            {loading ? "Finding..." : "Recommend"}
                            <span>→</span>
                        </button>

                    </div>

                    {/* ERROR */}
                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                </section>

                {/* ==================================================
                    POPULAR MOVIES
                    Shows initially.
                    Disappears after successful recommendation search.
                ================================================== */}
                {!loading && recommendations.length === 0 && (
                    <section className="popular-section">

                        <div className="section-header">

                            <div>
                                <small>EXPLORE</small>
                                <h2>Popular Movies</h2>
                            </div>

                        </div>

                        {popularMovies.length > 0 ? (

                            <div className="movie-grid">

                                {popularMovies.map((movie, index) => (

                                    <div
                                        className="movie-card"
                                        key={`${movie.title}-${index}`}
                                    >

                                        {/* POSTER */}
                                        {movie.poster ? (

                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="movie-poster"
                                            />

                                        ) : (

                                            <div className="poster-placeholder">
                                                Poster unavailable
                                            </div>

                                        )}

                                        {/* INFO */}
                                        <div className="movie-info">

                                            <h3>
                                                {movie.title}
                                            </h3>

                                            <div className="movie-details">

                                                <span>
                                                    ⭐{" "}
                                                    {Number(
                                                        movie.rating || 0
                                                    ).toFixed(1)}
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        ) : (

                            <div className="empty-state">

                                <div className="empty-icon">
                                    🎬
                                </div>

                                <h3>
                                    Unable to load popular movies
                                </h3>

                                <p>
                                    Please make sure the backend is running.
                                </p>

                            </div>

                        )}

                    </section>
                )}

                {/* ==================================================
                    LOADING
                ================================================== */}
                {loading && (
                    <section className="recommendations">

                        <div className="empty-state">

                            <div className="empty-icon">
                                🎬
                            </div>

                            <h3>
                                Finding movies for you...
                            </h3>

                            <p>
                                Our recommendation model is working.
                            </p>

                        </div>

                    </section>
                )}

                {/* ==================================================
                    RECOMMENDATIONS
                    Shows after successful search.
                ================================================== */}
                {!loading && recommendations.length > 0 && (

                    <section className="recommendations">

                        {/* SECTION HEADER */}
                        <div className="section-header">

                            <div>
                                <small>DISCOVER</small>

                                <h2>
                                    Recommended Movies
                                </h2>
                            </div>

                        </div>

                        {/* =========================
                            SELECTED MOVIE
                        ========================= */}
                        <div className="selected-movie">

                            {/* POSTER */}
                            {moviePoster ? (

                                <img
                                    src={moviePoster}
                                    alt={movie}
                                    className="selected-movie-poster"
                                />

                            ) : (

                                <div className="selected-poster-unavailable">
                                    Poster unavailable
                                </div>

                            )}

                            {/* MOVIE NAME */}
                            <div className="selected-movie-info">

                                <small>
                                    YOU SELECTED
                                </small>

                                <h2>
                                    {movie}
                                </h2>

                            </div>

                        </div>

                        {/* =========================
                            RECOMMENDATION GRID
                        ========================= */}
                        <div className="movie-grid">

                            {recommendations.map((rec, index) => (

                                <div
                                    className="movie-card"
                                    key={`${rec.title}-${index}`}
                                >

                                    {/* POSTER */}
                                    {rec.poster ? (

                                        <img
                                            src={rec.poster}
                                            alt={rec.title}
                                            className="movie-poster"
                                        />

                                    ) : (

                                        <div className="poster-placeholder">
                                            Poster unavailable
                                        </div>

                                    )}

                                    {/* INFO */}
                                    <div className="movie-info">

                                        <h3>
                                            {rec.title}
                                        </h3>

                                        <div className="movie-details">

                                            <span>
                                                ⭐{" "}
                                                {Number(
                                                    rec.rating || 0
                                                ).toFixed(1)}
                                            </span>

                                            <span>
                                                Match{" "}
                                                {(
                                                    Number(rec.score || 0) *
                                                    100
                                                ).toFixed(1)}
                                                %
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </section>
                )}

            </main>

            {/* =========================
                FOOTER
            ========================= */}
            <footer>

                <p>
                    MovieRecommender • Built with React & Machine Learning
                </p>

            </footer>

        </div>
    );
}

export default App;
