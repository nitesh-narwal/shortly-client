import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import TextField from './TextField';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { FaUserPlus, FaUser, FaEnvelope, FaLock, FaLink, FaRocket, FaCheckCircle, FaSpinner, FaPaperPlane } from 'react-icons/fa';
import { HiSparkles, HiMail } from 'react-icons/hi';
import { motion } from 'framer-motion';

/**
 * RegisterPage - User registration with email verification
 *
 * Flow:
 * 1. User fills registration form
 * 2. Form submits to /api/auth/public/register
 * 3. Backend creates user and sends verification email
 * 4. UI shows "Check your email" message
 * 5. User must verify email before logging in
 */
const RegisterPage = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const registerHandler = async (data) => {
        setLoader(true);
        try {
            const { data: response } = await api.post(
                "/api/auth/public/register",
                data
            );
            setRegisteredEmail(data.email);
            setRegistrationSuccess(true);
            reset();
            toast.success("Registration Successful! Check your email to verify.");
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || error.response?.data || "Registration Failed!";
            toast.error(typeof errorMessage === 'string' ? errorMessage : "Registration Failed!");
        } finally {
            setLoader(false);
        }
    };

    const handleResendVerification = async () => {
        setResendLoading(true);
        try {
            await api.post('/api/auth/public/resend-verification', { email: registeredEmail });
            toast.success('Verification email sent! Please check your inbox.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setResendLoading(false);
        }
    };

    const benefits = [
        "Free forever plan available",
        "No credit card required",
        "Unlimited link shortening",
        "Detailed click analytics",
        "Custom branded links",
        "24/7 customer support"
    ];

    return (
        <div className='min-h-[calc(100vh-64px)] flex'>
            {/* Left Side - Registration Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50 px-4 py-8">
                <motion.div 
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <FaUserPlus className="text-white text-2xl" />
                        </div>
                    </div>

                    {/* Show verification email sent message after successful registration */}
                    {registrationSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white shadow-2xl shadow-slate-200/50 py-8 sm:px-8 px-6 rounded-2xl border border-slate-100 text-center"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <HiMail className="text-white text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Check Your Email!</h2>
                            <p className="text-slate-600 mb-6">
                                We've sent a verification link to <span className="font-semibold text-purple-600">{registeredEmail}</span>
                            </p>

                            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <HiSparkles className="text-purple-500 text-xl flex-shrink-0 mt-0.5" />
                                    <div className="text-left">
                                        <p className="text-purple-800 font-semibold text-sm">What's next?</p>
                                        <ul className="text-purple-700 text-sm mt-1 space-y-1">
                                            <li>1. Open your email inbox</li>
                                            <li>2. Click the verification link</li>
                                            <li>3. Start shortening URLs!</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-rose-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-700 hover:to-rose-600 transition-all duration-200 shadow-lg"
                                >
                                    Go to Login
                                </Link>

                                <button
                                    onClick={handleResendVerification}
                                    disabled={resendLoading}
                                    className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 py-3 px-6 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200 disabled:opacity-50"
                                >
                                    {resendLoading ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane />
                                            Resend Verification Email
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="text-sm text-slate-500 mt-6">
                                Didn't receive the email? Check your spam folder or request a new link.
                            </p>
                        </motion.div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-slate-800">Create Your Account</h1>
                                <p className="text-slate-600 mt-2">Join thousands of users shortening links with Shortly</p>
                            </div>

                            <form onSubmit={handleSubmit(registerHandler)}
                                className="bg-white shadow-2xl shadow-slate-200/50 py-8 sm:px-8 px-6 rounded-2xl border border-slate-100">

                        <div className="flex flex-col gap-5">
                            {/* Username Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Username
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <FaUser />
                                    </div>
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="Choose a username"
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-slate-50 focus:bg-white ${
                                            errors.username?.message 
                                                ? "border-red-400 focus:border-red-500" 
                                                : "border-slate-200 focus:border-purple-500"
                                        }`}
                                        {...register("username", {
                                            required: { value: true, message: "*Username is required" }
                                        })}
                                    />
                                </div>
                                {errors.username?.message && (
                                    <p className="text-sm font-medium text-red-500 mt-1">
                                        {errors.username?.message}
                                    </p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="Enter your email"
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-slate-50 focus:bg-white ${
                                            errors.email?.message 
                                                ? "border-red-400 focus:border-red-500" 
                                                : "border-slate-200 focus:border-purple-500"
                                        }`}
                                        {...register("email", {
                                            required: { value: true, message: "*Email is required" },
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Invalid email format"
                                            }
                                        })}
                                    />
                                </div>
                                {errors.email?.message && (
                                    <p className="text-sm font-medium text-red-500 mt-1">
                                        {errors.email?.message}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="relative">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <FaLock />
                                    </div>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="Create a strong password"
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-slate-50 focus:bg-white ${
                                            errors.password?.message 
                                                ? "border-red-400 focus:border-red-500" 
                                                : "border-slate-200 focus:border-purple-500"
                                        }`}
                                        {...register("password", {
                                            required: { value: true, message: "*Password is required" },
                                            minLength: { value: 6, message: "Minimum 6 characters required" }
                                        })}
                                    />
                                </div>
                                {errors.password?.message && (
                                    <p className="text-sm font-medium text-red-500 mt-1">
                                        {errors.password?.message}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500 mt-1">Must be at least 6 characters</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={loader}
                            type='submit'
                            className='w-full mt-6 py-3.5 bg-gradient-to-r from-purple-600 to-rose-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2'>
                            {loader ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <FaRocket />
                                    <span>Create Account</span>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-500">Already have an account?</span>
                            </div>
                        </div>

                        {/* Login Link */}
                        <Link to="/login" className="block">
                            <button 
                                type="button" 
                                className='w-full py-3.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2'
                            >
                                Sign In Instead
                            </button>
                        </Link>
                    </form>

                    {/* Footer Text */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-purple-600 hover:underline">Privacy Policy</a>
                    </p>
                        </>
                    )}
                </motion.div>
            </div>

            {/* Right Side - Decorative Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-rose-500 to-orange-500 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                
                {/* Floating Circles */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-yellow-400/20 rounded-full filter blur-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium mb-6">
                            <HiSparkles className="text-yellow-300" />
                            Start your free trial today
                        </div>
                        
                        <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                            Start shortening <br />
                            links with <span className="text-yellow-300">Shortly</span>
                        </h2>
                        <p className="text-white/80 text-lg mb-10 max-w-md">
                            Join our community and get access to powerful URL shortening tools with detailed analytics.
                        </p>
                        
                        {/* Benefits List */}
                        <div className="grid grid-cols-2 gap-3">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                    className="flex items-center gap-2"
                                >
                                    <FaCheckCircle className="text-yellow-300 flex-shrink-0" />
                                    <span className="text-white/90 text-sm">{benefit}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">500</p>
                            <p className="text-white/60 text-sm">Active Users</p>
                        </div>
                        <div className="w-px h-12 bg-white/20"></div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">1k+</p>
                            <p className="text-white/60 text-sm">Links Created</p>
                        </div>
                    </div>
                </motion.div>

                {/* Floating Link Card */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="absolute top-20 right-10 bg-white rounded-2xl p-4 shadow-2xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-rose-500 rounded-lg flex items-center justify-center">
                            <FaLink className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Your shortened link</p>
                            <p className="text-sm font-semibold text-slate-800">shortly.niteshh.me/abc123</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default RegisterPage
