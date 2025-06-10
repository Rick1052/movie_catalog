import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

import Footer from '@/Components/Footer';

export default function GuestLayout({ children }) {
    const { auth } = usePage().props;
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Navbar */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        {/* Logo e título */}
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                            </Link>
                            <Link
                                href={route('home')}
                                className="text-lg font-semibold text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                Home
                            </Link>
                            <Link
                                href={route('dashboard')}
                                className="text-lg font-semibold text-gray-800 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <span className="text-lg font-semibold text-gray-800 dark:text-white">Catálogo</span>
                            </Link>
                        </div>

                        {/* Ações lado direito */}
                        <div className="flex items-center gap-4">
                            {/* Botão de tema */}
                            <button
                                onClick={toggleTheme}
                                className="relative inline-flex items-center h-8 rounded-full w-14 focus:outline-none border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition"
                                aria-label="Toggle Dark Mode"
                            >
                                <span
                                    className={`${
                                        theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
                                    } inline-block w-6 h-6 transform bg-yellow-400 rounded-full transition-transform`}
                                >
                                    {theme === 'dark' ? (
                                        <svg className="w-6 h-6 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M17.293 13.293a8 8 0 01-11.586-11.586 8 8 0 0011.586 11.586z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 5a1 1 0 011 1v1a1 1 0 11-2 0V6a1 1 0 011-1zm4.22 1.78a1 1 0 010 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7a1 1 0 011.42 0zM15 10a1 1 0 011 1h1a1 1 0 110 2h-1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-1.78a1 1 0 011.42 0l.7.7a1 1 0 11-1.42 1.42l-.7-.7a1 1 0 010-1.42zM5 10a1 1 0 011-1H7a1 1 0 110 2H6a1 1 0 01-1-1zm4.95-5.95a1 1 0 00-1.4 1.4l.7.7a1 1 0 001.42-1.42l-.7-.7z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </span>
                                <span className="sr-only">Alternar tema</span>
                            </button>

                            {/* Login (se não autenticado) */}
                            {!auth?.user && (
                                <Link
                                    href="/login"
                                    className="text-sm px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                                >
                                    Entrar
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Conteúdo */}
            <main className="flex flex-1 min-h-[80vh] items-center justify-center">{children}</main>

            <Footer/>
        </div>
    );
}
