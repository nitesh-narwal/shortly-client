import React, { useState, useEffect } from 'react'
import { FaHome, FaArrowLeft, FaRedo, FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';

const ErrorPage = ({ message }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Determine if it's a 404 or general error
  const is404 = message?.toLowerCase().includes("find") || message?.toLowerCase().includes("page");

  const quickLinks = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Dashboard", path: "/dashboard", icon: <FaSearch /> },
    { name: "About", path: "/about", icon: <HiSparkles /> },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Interactive Background Gradient */}
      <div 
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)`,
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-[10%] w-20 h-20 bg-rose-500/20 rounded-2xl blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 right-[15%] w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-[20%] w-24 h-24 bg-blue-500/20 rounded-full blur-xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* Error Code */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-8"
          >
            <span className="text-[150px] sm:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-rose-400 via-purple-500 to-blue-500 leading-none select-none">
              404
            </span>
            {/* Glowing effect behind */}
            <div className="absolute inset-0 text-[150px] sm:text-[200px] font-black text-rose-500/20 blur-3xl leading-none -z-10">
              404
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {is404 ? "Page Not Found" : "Oops! Something went wrong"}
            </h1>
            <p className="text-slate-400 text-lg mb-2">
              {message ? message : "The page you're looking for doesn't exist or has been moved."}
            </p>
            {location.pathname !== "/" && (
              <p className="text-slate-500 text-sm font-mono bg-slate-800/50 inline-block px-4 py-2 rounded-lg mb-8">
                {location.pathname}
              </p>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-12"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <FaArrowLeft />
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-rose-500/25 hover:scale-105"
            >
              <FaHome />
              Back to Home
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
            >
              <FaRedo />
              Refresh
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10"
          >
            <p className="text-slate-400 text-sm mb-4">Or try one of these pages:</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => navigate(link.path)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white rounded-lg transition-all duration-200 text-sm"
                >
                  {link.icon}
                  {link.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Fun Element - Animated Robot/Character */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12"
          >
            <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-2xl"
              >
                🔍
              </motion.span>
              <span>Lost? Don't worry, we'll help you find your way!</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-10 left-10 w-20 h-20 border-l-2 border-t-2 border-white/10 rounded-tl-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-r-2 border-t-2 border-white/10 rounded-tr-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-l-2 border-b-2 border-white/10 rounded-bl-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-r-2 border-b-2 border-white/10 rounded-br-3xl pointer-events-none"></div>
    </div>
  )
}

export default ErrorPage
