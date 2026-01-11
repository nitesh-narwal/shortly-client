import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import TextField from './TextField';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import toast from 'react-hot-toast';
import { useStoreContext } from '../contextApi/ContextApi';
import { FaUser, FaLock, FaSignInAlt, FaLink, FaShieldAlt, FaChartLine, FaEnvelope, FaSpinner, FaPaperPlane } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';

/**
 * LoginPage - User login with email verification check
 * 
 * Flow:
 * 1. User enters credentials
 * 2. Backend checks if email is verified
 * 3. If not verified, shows error with option to resend verification
 * 4. If verified, returns JWT token and redirects to dashboard
 */
const LoginPage = () => {
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [showResendOption, setShowResendOption] = useState(false);
    const [resendEmail, setResendEmail] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const {setToken, setUserInfo} = useStoreContext();

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: {errors}
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
        mode: "onTouched",
    });

    const loginHandler = async (data) => {
        setLoader(true);
        setShowResendOption(false);
        try {
            const { data: response } = await api.post(
                "/api/auth/public/login",
                data
            );
            // Storing the token in localStorage
            // console.log(response.token);
            localStorage.setItem("JWT_TOKEN", JSON.stringify(response.token));

            // Store user info for profile display
            const userInfo = {
                username: response.username,
                email: response.email,
            };
            setUserInfo(userInfo);

            toast.success("Login Successful!")
            setToken(response.token);
            reset();
            navigate("/dashboard");
            
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || error.response?.data || "Login Failed! Please check your credentials.";
            
            // Check if error is about email verification
            if (typeof errorMessage === 'string' && errorMessage.toLowerCase().includes('verify')) {
                setShowResendOption(true);
                toast.error("Please verify your email first");
            } else {
                toast.error(typeof errorMessage === 'string' ? errorMessage : "Login Failed!");
            }
        } finally {
            setLoader(false);
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
            setShowResendOption(false);
            setResendEmail('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to resend verification email');
        } finally {
            setResendLoading(false);
        }
    };

    const features = [
        { icon: <FaLink />, text: "Shorten unlimited URLs" },
        { icon: <FaChartLine />, text: "Track click analytics" },
        { icon: <FaShieldAlt />, text: "Secure & encrypted links" },
    ];

    return (
        <div className='min-h-[calc(100vh-64px)] flex'>
            {/* Left Side - Decorative Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-rose-500 via-purple-600 to-blue-600 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
                
                {/* Floating Circles */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-400/20 rounded-full filter blur-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                            Welcome back to <br />
                            <span className="text-yellow-300">Shortly</span>
                        </h2>
                        <p className="text-white/80 text-lg mb-10 max-w-md">
                            Your powerful URL shortening platform. Login to manage your links and track performance.
                        </p>
                        
                        {/* Features List */}
                        <div className="space-y-4">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                                    className="flex items-center gap-3"
                                >
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white">
                                        {feature.icon}
                                    </div>
                                    <span className="text-white/90">{feature.text}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Decorative Image/Card at bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
                >
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl">✓</span>
                        </div>
                        <div>
                            <p className="text-white font-semibold">1K+ Links Created</p>
                            <p className="text-white/60 text-sm">Trusted by users worldwide</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-rose-50 px-4 py-8">
                <motion.div 
                    className="w-full max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <FaSignInAlt className="text-white text-2xl" />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">Welcome Back</h1>
                        <p className="text-slate-600 mt-2">Sign in to continue to your dashboard</p>
                    </div>

                    <form onSubmit={handleSubmit(loginHandler)}
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
                                        placeholder="Enter your username"
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-slate-50 focus:bg-white ${
                                            errors.username?.message 
                                                ? "border-red-400 focus:border-red-500" 
                                                : "border-slate-200 focus:border-rose-500"
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
                                        placeholder="Enter your password"
                                        className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl outline-none transition-all duration-200 bg-slate-50 focus:bg-white ${
                                            errors.password?.message 
                                                ? "border-red-400 focus:border-red-500" 
                                                : "border-slate-200 focus:border-rose-500"
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
                            </div>
                        </div>

                        {/* Email Not Verified - Resend Option */}
                        {showResendOption && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4"
                            >
                                <p className="text-amber-800 text-sm font-medium mb-3">
                                    📧 Your email is not verified. Enter your email to receive a new verification link.
                                </p>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                            <FaEnvelope className="text-sm" />
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={resendEmail}
                                            onChange={(e) => setResendEmail(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border-2 rounded-lg outline-none border-amber-200 focus:border-amber-400"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        disabled={resendLoading}
                                        className="px-4 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {resendLoading ? (
                                            <FaSpinner className="animate-spin" />
                                        ) : (
                                            <FaPaperPlane />
                                        )}
                                        Send
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Forgot Password Link */}
                        <div className="flex justify-end mt-2">
                            <button type="button" className="text-sm text-rose-600 hover:text-rose-700 font-medium">
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            disabled={loader}
                            type='submit'
                            className='w-full mt-6 py-3.5 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2'>
                            {loader ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <FaSignInAlt />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-500">New to Shortly?</span>
                            </div>
                        </div>

                        {/* Register Link */}
                        <Link to="/register" className="block">
                            <button 
                                type="button" 
                                className='w-full py-3.5 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-2'
                            >
                                <HiSparkles className="text-rose-500" />
                                Create an Account
                            </button>
                        </Link>
                    </form>

                    {/* Footer Text */}
                    <p className="text-center text-sm text-slate-500 mt-6">
                        By signing in, you agree to our{' '}
                        <a href="#" className="text-rose-600 hover:underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-rose-600 hover:underline">Privacy Policy</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default LoginPage
