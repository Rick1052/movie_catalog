import React, { useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function FavoritesIndex({ auth, favorites }) {
    const [moviesDetails, setMoviesDetails] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            setLoading(true);
            const details = {};
            for (const favorite of favorites) {
                try {
                    const response = await axios.get(`/api/movies/${favorite.movie_id}`);
                    details[favorite.movie_id] = response.data;
                } catch (error) {
                    console.error(`Erro ao buscar detalhes do filme ${favorite.movie_id}:`, error);
                }
            }
            setMoviesDetails(details);
            setLoading(false);
        };

        fetchMovieDetails();
    }, [favorites]);

    const handleRemove = (movieId) => {
        if (confirm('Remover este filme dos favoritos?')) {
            router.delete(route('favorites.destroy', movieId));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Seus Filmes Favoritos
                        </h1>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                            </div>
                        ) : favorites.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    Você não tem filmes favoritos ainda.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {favorites.map(({ id, movie_id }) => {
                                    const movie = moviesDetails[movie_id];
                                    if (!movie) return null;

                                    return (
                                        <div 
                                            key={id} 
                                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 flex flex-col"
                                        >
                                            <Link href={`/movies/${movie_id}`} className="flex-grow">
                                                <div className="relative">
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                                        alt={movie.title}
                                                        className="w-full h-auto object-cover"
                                                    />
                                                    <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                                                        {movie.vote_average?.toFixed(1)}
                                                    </div>
                                                </div>
                                                <div className="p-4 flex flex-col flex-grow">
                                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                        {movie.title}
                                                    </h2>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                                        {movie.overview}
                                                    </p>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        <p>Lançamento: {movie.release_date}</p>
                                                        <p>Votos: {movie.vote_count}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            <div className="p-4 pt-0">
                                                <button
                                                    onClick={() => handleRemove(id)}
                                                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300 font-medium"
                                                >
                                                    Remover dos favoritos
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
