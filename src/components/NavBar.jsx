import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { FaCog, FaSignOutAlt, FaChevronDown } from "react-icons/fa";
import { useStoreContext } from "../contextApi/ContextApi";
import toast from "react-hot-toast";


const Navbar = () => {
  const navigate = useNavigate();
  const { token, userInfo, clearUserInfo } = useStoreContext();
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const onLogOutHandler = () => {
    setUserMenuOpen(false);
    clearUserInfo();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const onSettingsHandler = () => {
    setUserMenuOpen(false);
    navigate("/settings");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    
        <div className="h-16 bg-gradient-to-r from-slate-900/95 via-purple-900/90 to-rose-900/95 backdrop-blur-xl z-[999] flex items-center sticky top-0 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border-b border-white/10">
    <div className="lg:px-14 sm:px-8 px-4 w-full flex justify-between items-center">
        <Link to="/">
          <h1 className="font-bold text-3xl text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-200 to-purple-200 italic hover:scale-105 transition-transform duration-300 drop-shadow-lg">
            Shortly
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-8">
          <Link
            className={`${
              path === "/" ? "text-white font-semibold" : "text-gray-300"
            } hover:text-white font-medium transition-all duration-300 relative group`}
            to="/"
          >
            Home
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-rose-400 to-purple-400 transition-all duration-300 ${path === "/" ? "w-full" : "w-0 group-hover:w-full"}`}></span>
          </Link>
          <Link
            className={`${
              path === "/about" ? "text-white font-semibold" : "text-gray-300"
            } hover:text-white font-medium transition-all duration-300 relative group`}
            to="/about"
          >
            About
            <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-rose-400 to-purple-400 transition-all duration-300 ${path === "/about" ? "w-full" : "w-0 group-hover:w-full"}`}></span>
          </Link>
          {token && (
            <Link
              className={`${
                path === "/dashboard" ? "text-white font-semibold" : "text-gray-300"
              } hover:text-white font-medium transition-all duration-300 relative group`}
              to="/dashboard"
            >
              Dashboard
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-rose-400 to-purple-400 transition-all duration-300 ${path === "/dashboard" ? "w-full" : "w-0 group-hover:w-full"}`}></span>
            </Link>
          )}

          {!token && (
            <Link to="/register">
              <button className="bg-gradient-to-r from-rose-500 to-purple-600 text-white cursor-pointer px-6 py-2.5 rounded-xl font-semibold hover:from-rose-600 hover:to-purple-700 shadow-lg shadow-rose-500/25 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-rose-500/30 border border-white/20">
                SignUp
              </button>
            </Link>
          )}

          {/* User Profile Dropdown - Desktop */}
          {token && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white cursor-pointer px-4 py-2 rounded-full hover:bg-white/20 transition-all duration-300 shadow-lg border border-white/20 hover:border-white/40"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-white text-sm font-bold drop-shadow">
                    {userInfo?.username?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="font-medium max-w-[80px] truncate">
                  {userInfo?.username || "User"}
                </span>
                <FaChevronDown className={`text-xs transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/50 overflow-hidden z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="px-5 py-5 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 border-b border-gray-200/50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-400 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                        <span className="text-white text-xl font-bold drop-shadow">
                          {userInfo?.username?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-800 truncate">
                          {userInfo?.username || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {userInfo?.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-3 px-2">
                    <button
                      onClick={onSettingsHandler}
                      className="flex items-center gap-4 px-4 py-3 w-full text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group cursor-pointer"
                    >
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-300/50 transition-all duration-300">
                        <FaCog className="text-blue-600 group-hover:rotate-90 transition-transform duration-500" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold block text-gray-800">Settings</span>
                        <p className="text-xs text-gray-400">Manage your account</p>
                      </div>
                    </button>

                    <div className="border-t border-gray-200/50 mx-4 my-2"></div>

                    <button
                      onClick={onLogOutHandler}
                      className="flex items-center gap-4 w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 rounded-xl transition-all duration-300 group cursor-pointer"
                    >
                      <div className="w-11 h-11 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-red-300/50 transition-all duration-300">
                        <FaSignOutAlt className="text-red-600 group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold block group-hover:text-red-600 transition-colors">Logout</span>
                        <p className="text-xs text-gray-400">Sign out of account</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden flex items-center gap-3">
          {/* User Button - Mobile */}
          {token && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setUserMenuOpen(!userMenuOpen);
                }}
                className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full hover:from-rose-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-rose-500/30 border border-white/20"
              >
                <span className="text-white font-bold drop-shadow">
                  {userInfo?.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </button>

              {/* Mobile Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/20 border border-white/50 overflow-hidden z-[9999]">
                  <div className="px-5 py-5 bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-blue-500/10 border-b border-gray-200/50">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-rose-400 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                        <span className="text-white text-xl font-bold drop-shadow">
                          {userInfo?.username?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-gray-800 truncate">
                          {userInfo?.username || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {userInfo?.email || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="py-3 px-2">
                    <button
                      onClick={onSettingsHandler}
                      className="flex items-center gap-4 px-4 py-3 w-full text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-11 h-11 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                        <FaCog className="text-blue-600" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold block text-gray-800">Settings</span>
                        <p className="text-xs text-gray-400">Manage your account</p>
                      </div>
                    </button>

                    <div className="border-t border-gray-200/50 mx-4 my-2"></div>

                    <button
                      onClick={onLogOutHandler}
                      className="flex items-center gap-4 w-full px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 rounded-xl transition-all duration-300 cursor-pointer"
                    >
                      <div className="w-11 h-11 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                        <FaSignOutAlt className="text-red-600" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold block text-gray-800">Logout</span>
                        <p className="text-xs text-gray-400">Sign out of account</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300"
          >
            {navbarOpen ? (
              <RxCross2 className="text-white text-2xl" />
            ) : (
              <IoIosMenu className="text-white text-2xl" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`sm:hidden absolute left-0 top-[64px] w-full bg-gradient-to-b from-slate-900/98 via-purple-900/95 to-rose-900/98 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-white/10 transition-all duration-300 ${
            navbarOpen ? "max-h-96 py-6" : "max-h-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col gap-2 px-6">
            <Link
              onClick={() => setNavbarOpen(false)}
              className={`${
                path === "/" ? "text-white font-semibold bg-white/10" : "text-gray-300"
              } hover:text-white hover:bg-white/10 font-medium transition-all duration-300 py-3 px-4 rounded-xl`}
              to="/"
            >
              Home
            </Link>
            <Link
              onClick={() => setNavbarOpen(false)}
              className={`${
                path === "/about" ? "text-white font-semibold bg-white/10" : "text-gray-300"
              } hover:text-white hover:bg-white/10 font-medium transition-all duration-300 py-3 px-4 rounded-xl`}
              to="/about"
            >
              About
            </Link>
            {token && (
              <Link
                onClick={() => setNavbarOpen(false)}
                className={`${
                  path === "/dashboard" ? "text-white font-semibold bg-white/10" : "text-gray-300"
                } hover:text-white hover:bg-white/10 font-medium transition-all duration-300 py-3 px-4 rounded-xl`}
                to="/dashboard"
              >
                Dashboard
              </Link>
            )}
            {!token && (
              <Link to="/register" onClick={() => setNavbarOpen(false)}>
                <button className="bg-gradient-to-r from-rose-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-purple-700 shadow-lg shadow-rose-500/25 transition-all w-full mt-2 border border-white/20">
                  SignUp
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
