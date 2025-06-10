import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Dashboard({ auth, movies }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMovies, setFilteredMovies] = useState(movies);

    useEffect(() => {
        const filtered = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    }, [searchTerm, movies]);

    return (
        <AuthenticatedLayout auth={auth}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Filmes Populares
                            </h1>
                            <div className="relative max-w-xl mx-auto">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Buscar filme por nome..."
                                        className="w-full px-4 py-3 pl-10 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-lg"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {searchTerm && (
                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                        {filteredMovies.length} {filteredMovies.length === 1 ? 'filme encontrado' : 'filmes encontrados'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredMovies.map((movie) => (
                                <div
                                    key={movie.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105"
                                >
                                    <a href={`/movies/${movie.id}`} className="block">
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
                                        <div className="p-4">
                                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                {movie.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {movie.overview}
                                            </p>
                                            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                                                <p>Lançamento: {movie.release_date}</p>
                                                <p>Votos: {movie.vote_count}</p>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>

                        {filteredMovies.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    Nenhum filme encontrado com esse nome.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 