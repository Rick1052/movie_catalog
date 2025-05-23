import React from 'react';

export default function Show({ movie }) {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="mb-6 rounded shadow"
            />
            <p className="mb-4">{movie.overview}</p>
            <p className="text-gray-700 mb-2">
                <strong>Lançamento:</strong> {movie.release_date}
            </p>
            <p className="text-gray-700 mb-2">
                <strong>Avaliação:</strong> {movie.vote_average.toFixed(1)} ({movie.vote_count} votos)
            </p>
            {/* Aqui você pode adicionar os comentários e avaliações dos usuários */}
        </div>
    );
}
