import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaLock, FaSpinner, FaUnlockAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../api/api';

const ShortenUrlPage = () => {
    const { url } = useParams();
    const [status, setStatus] = useState('checking'); // checking | redirecting | error | passwordRequired
    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [unlocking, setUnlocking] = useState(false);
    const [unlockError, setUnlockError] = useState('');

    const backendUrl = `${import.meta.env.VITE_BACKEND_URL}/${url}`;

    useEffect(() => {
        if (!url) return;

        // GET (not HEAD) with redirect:'manual' - a HEAD response never carries a body,
        // and we need the body to tell a password-protected link (401 + passwordRequired)
        // apart from a plain 404/410.
        fetch(backendUrl, { method: 'GET', redirect: 'manual' })
            .then(async (response) => {
                if (response.status === 302 || response.status === 301 || response.type === 'opaqueredirect') {
                    window.location.href = backendUrl;
                    setStatus('redirecting');
                    return;
                }

                let body = null;
                try {
                    body = await response.clone().json();
                } catch {
                    // non-JSON body, ignore
                }

                if (response.status === 401 && body?.passwordRequired) {
                    setStatus('passwordRequired');
                    return;
                }

                setErrorMessage(body?.message || '');
                setStatus('error');
            })
            .catch(() => {
                // Network/CORS error - try a direct redirect anyway, the browser will
                // surface whatever the backend actually returns.
                window.location.href = backendUrl;
            });
    }, [url, backendUrl]);

    const handleUnlock = async (e) => {
        e.preventDefault();
        if (!password) {
            setUnlockError('Enter the password for this link');
            return;
        }
        setUnlocking(true);
        setUnlockError('');
        try {
            const { data } = await api.post(`/api/public/urls/${url}/unlock`, { password });
            window.location.href = data.originalUrl;
        } catch (error) {
            if (error.response?.status === 429) {
                setUnlockError('Too many attempts. Please wait a moment and try again.');
            } else {
                setUnlockError(error.friendlyMessage || 'Incorrect password');
            }
            toast.error(error.friendlyMessage || 'Incorrect password');
        } finally {
            setUnlocking(false);
        }
    };

    if (status === 'passwordRequired') {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <FaLock className="text-white text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2 text-center">Password Protected</h1>
                    <p className="text-slate-600 mb-6 text-center text-sm">
                        This link requires a password before it will open.
                    </p>
                    <form onSubmit={handleUnlock} className="space-y-4">
                        <input
                            type="password"
                            autoFocus
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setUnlockError(''); }}
                            placeholder="Enter password"
                            className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all bg-slate-50 focus:bg-white ${
                                unlockError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-rose-500'
                            }`}
                        />
                        {unlockError && (
                            <p className="text-sm text-red-500 font-medium">{unlockError}</p>
                        )}
                        <button
                            type="submit"
                            disabled={unlocking}
                            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {unlocking ? <FaSpinner className="animate-spin" /> : <FaUnlockAlt />}
                            {unlocking ? 'Unlocking...' : 'Unlock Link'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 to-rose-50 px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationTriangle className="text-red-500 text-3xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-3">Link Not Available</h1>
                    <p className="text-slate-600 mb-6">
                        {errorMessage || 'This link is no longer accessible.'} It may have:
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
