import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { usePage } from '@inertiajs/react';

const MOVIE_CATEGORIES = {
    'Ação': 28,
    'Aventura': 12,
    'Animação': 16,
    'Comédia': 35,
    'Crime': 80,
    'Documentário': 99,
    'Drama': 18,
    'Família': 10751,
    'Fantasia': 14,
    'História': 36,
    'Terror': 27,
    'Música': 10402,
    'Mistério': 9648,
    'Romance': 10749,
    'Ficção Científica': 878,
    'TV Movie': 10770,
    'Suspense': 53,
    'Guerra': 10752,
    'Faroeste': 37
};

export default function Home({ auth }) {
    const [categories, setCategories] = useState({});
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!auth?.user;
    const scrollRefs = useRef({});

    useEffect(() => {
        const fetchMoviesByCategory = async () => {
            setLoading(true);
            const categoryData = {};

            for (const [categoryName, categoryId] of Object.entries(MOVIE_CATEGORIES)) {
                try {
                    const response = await axios.get(`/api/movies/discover`, {
                        params: {
                            with_genres: categoryId,
                            page: 1
                        }
                    });
                    categoryData[categoryName] = response.data.results.slice(0, 15);
                } catch (error) {
                    console.error(`Erro ao buscar filmes da categoria ${categoryName}:`, error);
                }
            }

            setCategories(categoryData);
            setLoading(false);
        };

        fetchMoviesByCategory();
    }, []);

    const scrollLeft = (categoryName) => {
        const container = scrollRefs.current[categoryName];
        if (container) {
            container.scrollBy({ left: -400, behavior: 'smooth' });
        }
    };

    const scrollRight = (categoryName) => {
        const container = scrollRefs.current[categoryName];
        if (container) {
            container.scrollBy({ left: 400, behavior: 'smooth' });
        }
    };

    const Layout = isAuthenticated ? AuthenticatedLayout : GuestLayout;

    return (
        <Layout auth={auth}>
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
                {loading ? (
                    <div className="flex justify-center items-center h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                    </div>
                ) : (
                    <div className="py-8 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                        {Object.entries(categories).map(([categoryName, movies]) => (
                            <div key={categoryName} className="mb-12 relative group">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {categoryName}
                                    </h2>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => scrollLeft(categoryName)}
                                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => scrollRight(categoryName)}
                                            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div
                                        ref={el => scrollRefs.current[categoryName] = el}
                                        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-none snap-x snap-mandatory pr-[25%]"
                                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                    >
                                        {movies.map((movie) => (
                                            <Link
                                                key={movie.id}
                                                href={`/movies/${movie.id}`}
                                                className="flex-none w-44 transform transition-all duration-300 hover:scale-105 snap-start"
                                            >
                                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
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
                                                    <div className="p-3 flex-grow">
                                                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                            {movie.title}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                            {movie.overview}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
} 