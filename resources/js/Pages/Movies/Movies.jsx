// resources/js/Pages/Movies.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Movies() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        axios.get('/api/movies').then(res => {
            setMovies(res.data.results);
        });
    }, []);

    return (
        <div className="grid grid-cols-4 gap-4 p-4">
            {movies.map(movie => (
                <div key={movie.id} className="border p-2">
                    <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} />
                    <h3>{movie.title}</h3>
                </div>
            ))}
        </div>
    );
}
