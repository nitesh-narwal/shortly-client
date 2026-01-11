import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

/**
 * VerifyEmailPage - Handles email verification from link
 * 
 * Flow:
 * 1. User clicks verification link in email
 * 2. This component extracts token from URL params
 * 3. Calls backend API to verify email
 * 4. Shows success/error message based on result
 */
const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'already_verified'
    const [message, setMessage] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    const token = searchParams.get('token');

    useEffect(() => {
        if (token) {
            verifyEmail();
        } else {
            setStatus('error');
            setMessage('Invalid verification link. No token provided.');
        }
    }, [token]);

    const verifyEmail = async () => {
        try {
            const response = await api.get(`/api/auth/public/verify-email?token=${token}`);
            setStatus('success');
            setMessage(response.data.message || 'Email verified successfully!');
            toast.success('Email verified successfully!');
        } catch (error) {
            const responseData = error.response?.data;
            const errorMessage = responseData?.message || 'Verification failed. The link may be expired or invalid.';

            // Check if already verified - redirect to login
            if (responseData?.alreadyVerified) {
                setStatus('already_verified');
                setMessage('Your email is already verified. You can proceed to login.');
                toast.success('Email is already verified!');
                return;
            }

            // Check if token is expired
            if (responseData?.expired) {
                setIsExpired(true);
                // Try to extract email from error message
                const emailMatch = errorMessage.match(/email: ([^\s]+)/);
                if (emailMatch) {
                    setResendEmail(emailMatch[1]);
                }
            }

            setStatus('error');
            setMessage(errorMessage);
        }
    };

    const handleResendVerification = async () => {
        if (!resendEmail) {
            toast.error('Please enter your email address');
            return;
        }

        setResendLoading(true);
        try {
            await api.post('/api/auth/public/resend-verification', { email: resendEmail });
            toast.success('Verification email sent! Please check your inbox.');
            setResendEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send verification email');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 px-4 py-8">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Status Card */}
                <div className="bg-white shadow-2xl shadow-slate-200/50 rounded-2xl border border-slate-100 overflow-hidden">
                    {/* Header with gradient */}
                    <div className={`p-8 text-center ${
                        status === 'success' || status === 'already_verified'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                            : status === 'error' 
                                ? 'bg-gradient-to-r from-red-500 to-rose-600' 
                                : 'bg-gradient-to-r from-purple-500 to-blue-600'
                    }`}>
                        <div className="flex justify-center mb-4">
                            {status === 'verifying' && (
                                <FaSpinner className="text-white text-5xl animate-spin" />
                            )}
                            {(status === 'success' || status === 'already_verified') && (
                                <FaCheckCircle className="text-white text-5xl" />
                            )}
                            {status === 'error' && (
                                <FaTimesCircle className="text-white text-5xl" />
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-white">
                            {status === 'verifying' && 'Verifying Your Email...'}
                            {status === 'success' && 'Email Verified!'}
                            {status === 'already_verified' && 'Already Verified!'}
                            {status === 'error' && 'Verification Failed'}
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <p className={`text-center mb-6 ${
                            status === 'success' || status === 'already_verified' ? 'text-green-600' : 
                            status === 'error' ? 'text-red-600' : 'text-slate-600'
                        }`}>
                            {message || (status === 'verifying' ? 'Please wait while we verify your email...' : '')}
                        </p>

                        {(status === 'success' || status === 'already_verified') && (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                    <div className="flex items-center gap-3">
                                        <HiSparkles className="text-green-500 text-xl" />
                                        <span className="text-green-700 text-sm">
                                            {status === 'already_verified'
                                                ? 'Your account was already verified. You can login now!'
                                                : 'Your account is now active. You can start shortening URLs!'
                                            }
                                        </span>
                                    </div>
                                </div>
                                <Link
                                    to="/login"
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25"
                                >
                                    Continue to Login
                                    <FaArrowRight />
                                </Link>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="space-y-4">
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <p className="text-red-700 text-sm">
                                        {isExpired
                                            ? 'Your verification link has expired. Don\'t worry! Enter your email below to receive a new verification link.'
                                            : 'The verification link is invalid or has already been used. If you\'ve already verified your email, please try logging in.'}
                                    </p>
                                </div>

                                {/* Resend Verification Form */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-semibold text-slate-700">
                                        {isExpired ? 'Get New Verification Link' : 'Request New Verification Email'}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <FaEnvelope />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={resendEmail}
                                            onChange={(e) => setResendEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-slate-50 focus:bg-white border-slate-200 focus:border-purple-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleResendVerification}
                                        disabled={resendLoading}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50"
                                    >
                                        {resendLoading ? (
                                            <>
                                                <FaSpinner className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <FaEnvelope />
                                                Resend Verification Email
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="text-center pt-4 border-t border-slate-100">
                                    <Link
                                        to="/login"
                                        className="text-purple-600 hover:text-purple-700 font-semibold"
                                    >
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmailPage;
