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
            <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
                <h1 className="text-3xl font-bold mb-6 text-center">Catálogo de Filmes</h1>

                {loading && <p className="text-center mb-4">Carregando...</p>}

                <div className="mb-8">
                    <div className="relative max-w-xl mx-auto">
                        <div className="flex items-center">
                            <div className="relative flex-grow">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Buscar filme por nome..."
                                    className="w-full px-4 py-3 pl-10 border-2 border-gray-300 dark:border-gray-600 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-lg"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <button
                                onClick={handleSearch}
                                className="px-4 py-3 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
                            >
                                Buscar
                            </button>
                            {searchInputRef.current?.value && (
                                <button
                                    onClick={handleClearSearch}
                                    className="ml-2 p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                                >
                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        {searchInputRef.current?.value && (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                {filteredMovies.length} {filteredMovies.length === 1 ? 'filme encontrado' : 'filmes encontrados'}
                            </p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {filteredMovies.map(movie => (
                        <Link key={movie.id} href={`/movies/${movie.id}`}>
                            <div className="bg-white dark:bg-gray-800 rounded shadow p-4 hover:shadow-lg transition flex flex-col items-center text-center">
                                <img
                                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                                    alt={movie.title}
                                    className="rounded mb-2 mx-auto"
                                />
                                <h2 className="text-lg font-semibold dark:text-gray-100">{movie.title}</h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Avaliação: {movie.vote_average.toFixed(1)}
                                </p>
                                <Link
                                    href={`/movies/${movie.id}`}
                                    className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                                >
                                    Ver mais
                                </Link>
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
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50 dark:text-gray-300"
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
                                className={`px-3 py-1 rounded ${pageNum === currentPage
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white dark:bg-gray-800 border dark:border-gray-600 dark:text-gray-300'
                                }`}
                            >
                                {pageNum}
                            </button>
                        ))}

                    <button
                        onClick={() => handlePageClick(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50 dark:text-gray-300"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </Layout>
    );
}
