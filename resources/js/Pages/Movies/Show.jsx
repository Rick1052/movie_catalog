import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import GuestLayout from '../../Layouts/GuestLayout';

export default function Show(props) {
    const { auth, errors, comments } = usePage().props;
    const { movie } = props;

    const [editingCommentId, setEditingCommentId] = useState(null);
    const { data, setData, post, put, delete: destroy, reset, processing } = useForm({
        movie_id: movie.id,
        content: '',
    });

    const [isAuthenticated, setIsAuthenticated] = useState(!!auth?.user);
    const [LayoutComponent, setLayoutComponent] = useState(() =>
        isAuthenticated ? AuthenticatedLayout : GuestLayout
    );

    const [successMessage, setSuccessMessage] = useState('');
    const [validationError, setValidationError] = useState('');

    const badWords = ['palavrão1', 'palavrão2', 'palavrão3']; 

    useEffect(() => {
        setIsAuthenticated(!!auth?.user);
        setLayoutComponent(() => (auth?.user ? AuthenticatedLayout : GuestLayout));
    }, [auth]);

    const startEdit = (comment) => {
        setEditingCommentId(comment.id);
        setData('content', comment.content);
        setValidationError('');
    };

    const cancelEdit = () => {
        setEditingCommentId(null);
        reset('content');
        setValidationError('');
    };

    function validateComment(content) {
        if (!content.trim()) {
            return 'O comentário não pode ficar vazio.';
        }

        const lowerContent = content.toLowerCase();
        for (const badWord of badWords) {
            if (lowerContent.includes(badWord)) {
                return 'O comentário contém linguagem inadequada.';
            }
        }

        const validPattern = /^[a-zA-Z0-9\s.,!?;:'"()-]*$/;
        if (!validPattern.test(content)) {
            return 'O comentário contém caracteres inválidos.';
        }

        return '';
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const errorMsg = validateComment(data.content);
        if (errorMsg) {
            setValidationError(errorMsg);
            return; // não envia se erro
        }

        setValidationError(''); // limpa erro se tudo ok

        if (editingCommentId) {
            put(route('comments.update', editingCommentId), {
                onSuccess: () => {
                    setSuccessMessage('Comentário atualizado com sucesso!');
                    setEditingCommentId(null);
                    reset('content');
                    setTimeout(() => setSuccessMessage(''), 3000);
                },
            });
        } else {
            post(route('comments.store'), {
                onSuccess: () => {
                    setSuccessMessage('Comentário adicionado com sucesso!');
                    reset('content');
                    setTimeout(() => setSuccessMessage(''), 3000);
                },
            });
        }
    };

    const handleDelete = (commentId) => {
        if (confirm('Tem certeza que deseja apagar este comentário?')) {
            destroy(route('comments.destroy', commentId), {
                onSuccess: () => {
                    setSuccessMessage('Comentário apagado com sucesso!');
                    if (editingCommentId === commentId) {
                        cancelEdit();
                    }
                    setTimeout(() => setSuccessMessage(''), 3000);
                },
            });
        }
    };

    return (
        <LayoutComponent
            auth={auth}
            errors={errors}
            header={isAuthenticated && (
                <>
                    {successMessage && (
                        <div className="mb-4 p-4 bg-green-100 text-green-800 rounded flex justify-between items-center">
                            <span>{successMessage}</span>
                            <button
                                onClick={() => setSuccessMessage('')}
                                className="ml-4 font-bold hover:text-green-600"
                                aria-label="Fechar mensagem de sucesso"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </>
            )}
        >
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow mb-6">
                    <div className="max-w-7xl mx-auto py-4 px-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Detalhes do Filme</h1>
                        <Link
                            href="/dashboard"
                            className="text-sm px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                        >
                            Voltar para o catálogo
                        </Link>
                    </div>
                </header>

                {/* Conteúdo principal */}
                <main className="max-w-4xl mx-auto px-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                        <h2 className="text-3xl font-semibold mb-4">{movie.title}</h2>

                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full md:w-1/3 rounded shadow"
                            />
                            <p className="leading-relaxed text-gray-800 dark:text-gray-300">
                                {movie.overview}
                            </p>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded">
                            <p className="text-sm mb-2">
                                <strong>Lançamento:</strong> {movie.release_date}
                            </p>
                            <p className="text-sm">
                                <strong>Avaliação:</strong> {movie.vote_average.toFixed(1)} ({movie.vote_count} votos)
                            </p>
                        </div>
                    </div>

                    {/* Comentários */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
                        <h3 className="text-2xl font-semibold mb-4">Comentários</h3>

                        {comments.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">Ainda não há comentários.</p>
                        ) : (
                            comments.map((comment) => (
                                <div
                                    key={comment.id}
                                    className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded"
                                >
                                    <p className="font-semibold text-indigo-700 dark:text-indigo-300">
                                        {comment.user.name}
                                    </p>
                                    <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </p>

                                    {isAuthenticated && auth.user.id === comment.user.id && (
                                        <div className="mt-2 flex gap-4">
                                            <button
                                                onClick={() => startEdit(comment)}
                                                className="text-sm text-indigo-600 hover:underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Apagar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Formulário para novo comentário ou edição */}
                    {isAuthenticated && (
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h3 className="text-xl font-semibold mb-2">
                                {editingCommentId ? 'Editar Comentário' : 'Adicionar Comentário'}
                            </h3>
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded mb-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                    rows={4}
                                    placeholder="Escreva seu comentário aqui..."
                                />
                                {/* Mensagem de erro de validação do front */}
                                {validationError && (
                                    <p className="text-red-500 text-sm mb-2">{validationError}</p>
                                )}
                                {/* Mensagem de erro vinda do backend */}
                                {errors.content && (
                                    <p className="text-red-500 text-sm">{errors.content}</p>
                                )}
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                        disabled={processing}
                                    >
                                        {editingCommentId ? 'Atualizar' : 'Enviar'}
                                    </button>

                                    {editingCommentId && (
                                        <button
                                            type="button"
                                            onClick={cancelEdit}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    )}
                </main>
            </div>
        </LayoutComponent>
    );
}
