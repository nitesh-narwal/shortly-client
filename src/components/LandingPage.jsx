import { useNavigate } from "react-router-dom";
import React from "react";
import { motion } from "framer-motion";
import { FaLink, FaChartLine, FaShieldAlt, FaBolt } from "react-icons/fa";

import Card from "./Card";
import { useStoreContext } from "../contextApi/ContextApi";

let desc =
  "Generate short, memorable links with ease using Shortly’s intuitive interface. Share URLs effortlessly across platforms. Optimize your sharing strategy with Shortly. Track clicks and manage your links seamlessly to enhance your online presence. Generate short, memorable links with ease using Shortly’s intuitive interface. Share URLs effortlessly across platforms.";

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();
  // console.log("TOKEN FROM LANDING PAGE: " + token);

  const dashBoardNavigateHandler = () => {
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/register");
    }
  };
  return (
    <div className="min-h-[calc(100vh-64px)] lg:px-14 sm:px-8 px-4 bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Hero Section */}
      <div className="lg:flex-row flex-col lg:py-16 pt-16 pb-8 lg:gap-16 gap-8 flex justify-between items-center">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <span className="bg-gradient-to-r from-rose-100 to-purple-100 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold">
              🚀 Fast & Reliable URL Shortener
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: -80 }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-bold font-roboto text-slate-800 md:text-6xl sm:text-5xl text-4xl md:leading-[70px] sm:leading-[55px] leading-[45px] lg:w-full md:w-[80%] w-full mb-6"
          >
            Shortly Simplifies URL Shortening For{" "}
            <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              Efficient Sharing
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-base leading-relaxed mb-8 lg:w-[90%]"
          >
            Shortly streamlines the process of URL shortening, making sharing
            links effortless and efficient. With its user-friendly interface,
            Shortly allows you to generate concise, easy-to-share URLs in
            seconds. Simplify your sharing experience with Shortly today.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex sm:flex-row flex-col items-center gap-4"
          >
            <button
              onClick={dashBoardNavigateHandler}
              className="bg-gradient-to-r from-rose-500 to-purple-600 sm:w-auto w-full text-white rounded-lg px-8 py-3.5 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
            >
              Manage Links
            </button>
            <button
              onClick={dashBoardNavigateHandler}
              className="border-2 border-rose-500 sm:w-auto w-full text-rose-600 rounded-lg px-8 py-3.5 font-semibold hover:bg-rose-50 transition-all duration-200"
            >
              Create Short Link
            </button>
          </motion.div>
        </div>
        <div className="flex-1 flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-purple-500 rounded-2xl blur-3xl opacity-20"></div>
            <img
              className="relative sm:w-[520px] w-[400px] object-cover rounded-2xl shadow-2xl"
              src="/images/img2.png"
              alt="URL Shortener Dashboard"
            />
          </motion.div>
        </div>
      </div>
      {/* Features Section */}
      <div className="sm:pt-20 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-rose-600 font-semibold text-sm uppercase tracking-wide mb-2 block">
            Why Choose Shortly
          </span>
          <h2 className="text-slate-800 font-roboto font-bold lg:w-[60%] md:w-[70%] sm:w-[80%] mx-auto text-4xl">
            Trusted by individuals and teams at the world's best companies
          </h2>
        </motion.div>
        
        <div className="grid lg:gap-6 gap-5 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          <Card
            title="Simple URL Shortening"
            desc="Experience the ease of creating short, memorable URLs in just a few clicks. Our intuitive interface and quick setup process ensure you can start shortening URLs without any hassle."
            icon={<FaLink className="text-rose-500 text-2xl" />}
          />
          <Card
            title="Powerful Analytics"
            desc="Gain insights into your link performance with our comprehensive analytics dashboard. Track clicks, geographical data, and referral sources to optimize your marketing strategies."
            icon={<FaChartLine className="text-purple-500 text-2xl" />}
          />
          <Card
            title="Enhanced Security"
            desc="Rest assured with our robust security measures. All shortened URLs are protected with advanced encryption, ensuring your data remains safe and secure."
            icon={<FaShieldAlt className="text-blue-500 text-2xl" />}
          />
          <Card
            title="Fast and Reliable"
            desc="Enjoy lightning-fast redirects and high uptime with our reliable infrastructure. Your shortened URLs will always be available and responsive, ensuring a seamless experience for your users."
            icon={<FaBolt className="text-yellow-500 text-2xl" />}
          />
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-rose-500 to-purple-600 rounded-2xl p-12 text-center mb-16 shadow-2xl"
      >
        <h2 className="text-white font-bold text-3xl mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-white/90 mb-8 max-w-2xl mx-auto">
          Join thousands of users who trust Shortly for their URL shortening needs. 
          Start creating and managing your short links today!
        </p>
        <button
          onClick={dashBoardNavigateHandler}
          className="bg-white text-rose-600 px-8 py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
        >
          {token ? "Go to Dashboard" : "Sign Up Now"}
        </button>
      </motion.div>
    </div>
  );
};

export default LandingPage;
