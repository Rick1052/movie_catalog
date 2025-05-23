import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchMovies = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(`/api/movies?page=${page}`);
            const data = response.data;

            setMovies(data.results);
            setTotalPages(data.total_pages);
            setCurrentPage(page);
        } catch (error) {
            console.error('Erro ao buscar filmes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(currentPage);
    }, []);

    const handlePageClick = (page) => {
        if (page > 0 && page <= totalPages) {
            fetchMovies(page);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Catálogo de Filmes</h1>

            {loading && <p className="text-center mb-4">Carregando...</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {movies.map(movie => (
                    <div key={movie.id} className="bg-white rounded shadow p-2 hover:shadow-lg transition">
                        <img
                            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                            alt={movie.title}
                            className="rounded mb-2"
                        />
                        <h2 className="text-lg font-semibold">{movie.title}</h2>
                        <p className="text-sm text-gray-600">Avaliação: {movie.vote_average.toFixed(1)}</p>
                        <Link
                            href={`/movies/${movie.id}`}
                            className="inline-block mt-2 text-blue-600 hover:underline text-sm"
                        >
                            Ver mais
                        </Link>


                    </div>
                ))}
            </div>

            {/* Paginação */}
            <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
                <button
                    onClick={() => handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
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
                                    : 'bg-white border'
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))
                }

                <button
                    onClick={() => handlePageClick(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                >
                    Próxima
                </button>
            </div>
        </div >
    );
}
