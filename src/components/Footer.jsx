import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaGithub, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-6 lg:px-14 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
              Shortly
            </h2>
            <p className="text-slate-400 mb-6 max-w-md">
              Simplifying URL shortening for efficient sharing. Create, manage, and track your links with powerful analytics.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="https://x.com/narwalnitesh14" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="https://www.linkedin.com/in/nitesh-narwal-b896a218b" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors">
                <FaLinkedin size={18} />
              </a>
              <a href="https://github.com/nitesh-narwal" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-rose-600 transition-colors">
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-white transition-colors">About</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/settings" className="text-slate-400 hover:text-white transition-colors">Settings</Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-3">
              <li className="text-slate-400">URL Shortening</li>
              <li className="text-slate-400">Click Analytics</li>
              <li className="text-slate-400">One-Time URLs</li>
              <li className="text-slate-400">Expiring Links</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Shortly. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            Made with <FaHeart className="text-rose-500" /> by Shortly Team
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

