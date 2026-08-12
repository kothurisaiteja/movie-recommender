import { useParams } from "react-router-dom";

function MovieDetails() {
    const { title } = useParams();

    return (
        <div className="movie-details-page">
            <h1>{title}</h1>
        </div>
    );
}

export default MovieDetails;