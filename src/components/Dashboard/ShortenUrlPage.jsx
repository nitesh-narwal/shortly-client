import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome } from 'react-icons/fa';

const ShortenUrlPage = () => {
    const { url } = useParams();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (url) {
            // Redirect to backend - Spring Boot handles short URL redirects at /{shortCode}
            const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/${url}`;

            // Use fetch to check if URL is valid first
            fetch(backendUrl, {
                method: 'HEAD',
                redirect: 'manual'
            })
            .then(response => {
                if (response.status === 302 || response.status === 301 || response.type === 'opaqueredirect') {
                    // URL is valid, redirect
                    window.location.href = backendUrl;
                } else {
                    // URL is not valid (expired, used, or doesn't exist)
                    setError(true);
                }
            })
            .catch(() => {
                // Network error or CORS - try direct redirect anyway
                window.location.href = backendUrl;
            });
        }
    }, [url]);

    if (error) {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-rose-50 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationTriangle className="text-red-500 text-3xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-3">Link Not Available</h1>
                    <p className="text-slate-600 mb-6">
                        This link is no longer accessible. It may have:
                    </p>
                    <ul className="text-left text-slate-600 mb-6 space-y-2">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            Expired
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            Already been used (one-time link)
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                            Been deleted by the owner
                        </li>
                    </ul>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        <FaHome />
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-rose-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mx-auto mb-4"></div>
                <p className="text-slate-600">Redirecting...</p>
            </div>
        </div>
    );
}

export default ShortenUrlPage;
