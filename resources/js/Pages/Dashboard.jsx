import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { usePage, Link, Head } from '@inertiajs/react';

import GuestLayout from '@/Layouts/GuestLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Dashboard(props) {
    const { auth } = usePage().props;
    const isAuthenticated = !!auth?.user;

    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const searchInputRef = useRef(null);

    const fetchMovies = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/movies?page=${page}`);
            const data = response.data;

            setMovies(data.results);
            setFilteredMovies(data.results);
            setTotalPages(data.total_pages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
            setMovies([]);
            setFilteredMovies([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(currentPage);
    }, [currentPage]);

    const handleSearch = () => {
        const searchTerm = searchInputRef.current.value;
        
        if (!searchTerm.trim()) {
            setFilteredMovies(movies);
            return;
        }

        const filtered = movies.filter(movie => 
            movie.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMovies(filtered);
    };

    const handleClearSearch = () => {
        searchInputRef.current.value = '';
        setFilteredMovies(movies);
    };

    const handlePageClick = (page) => {
        if (page > 0 && page <= totalPages) {
            fetchMovies(page);
        }
    };

    const Layout = isAuthenticated
        ? (props) => (
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight dark:text-gray-400">Catálogo</h2>}
            >
                <Head title="Dashboard" />
                {props.children}
            </AuthenticatedLayout>
        )
        : (props) => <GuestLayout {...props} />;

    return (
        <Layout {...props}>
            <div className="p-4 sm:p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Catálogo de Filmes</h1>

                <div className="mb-6 sm:mb-8">
                    <div className="relative max-w-xl mx-auto px-4 sm:px-0">
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <div className="relative w-full">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar filme por nome..."
                                    className="w-full px-4 py-2 sm:py-3 pl-10 border-2 border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-l-lg sm:rounded-r-none shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-base sm:text-lg"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleSearch}
                                    className="w-full sm:w-auto px-4 py-2 sm:py-3 bg-indigo-600 text-white rounded-lg sm:rounded-l-none sm:rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    Buscar
                                </button>
                                {searchInputRef.current?.value && (
                                    <button
                                        onClick={handleClearSearch}
                                        className="w-full sm:w-auto px-4 py-2 sm:py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none border-2 border-gray-300 dark:border-gray-600 rounded-lg"
                                    >
                                        Limpar
                                    </button>
                                )}
                            </div>
                        </div>
                        {searchInputRef.current?.value && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {filteredMovies.length} {filteredMovies.length === 1 ? 'filme encontrado' : 'filmes encontrados'}
                            </p>
                        )}
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                )}

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                    {filteredMovies.map(movie => (
                        <Link key={movie.id} href={`/movies/${movie.id}`} className="transform hover:scale-105 transition-transform duration-200">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 flex flex-col h-full">
                                <div className="relative pb-[150%]">
                                    <img
                                        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                        alt={movie.title}
                                        className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                                    />
                                </div>
                                <div className="p-4 flex-grow">
                                    <h2 className="text-base sm:text-lg font-semibold dark:text-gray-100 line-clamp-2">{movie.title}</h2>
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Avaliação: {movie.vote_average.toFixed(1)}
                                        </p>
                                        <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                            Ver mais
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredMovies.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Nenhum filme encontrado.
                        </p>
                    </div>
                )}

                {/* Paginação */}
                <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                    <button
                        onClick={() => handlePageClick(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-lg disabled:opacity-50 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        Anterior
                    </button>

                    {[...Array(totalPages).keys()]
                        .map(i => i + 1)
                        .filter(pageNum =>
                            pageNum >= Math.max(1, currentPage - 2) &&
                            pageNum <= Math.min(totalPages, currentPage + 2)
                        )
                        .map(pageNum => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageClick(pageNum)}
                                className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
                                    pageNum === currentPage
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white dark:bg-gray-800 border dark:border-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                    <button
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-lg disabled:opacity-50 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </Layout>
    );
}
