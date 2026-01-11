import React from "react";
import { FaLink, FaShieldAlt, FaChartLine, FaBolt, FaUsers, FaGlobe, FaRocket, FaHeart } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { motion } from "framer-motion";

const AboutPage = () => {
  const features = [
    {
      icon: <FaLink className="text-2xl" />,
      title: "Simple URL Shortening",
      desc: "Create short, memorable URLs in just a few clicks. Our intuitive interface ensures you can start shortening URLs without any hassle.",
      color: "rose"
    },
    {
      icon: <FaChartLine className="text-2xl" />,
      title: "Powerful Analytics",
      desc: "Gain insights into your link performance with our comprehensive analytics dashboard. Track clicks, geographical data, and referral sources.",
      color: "blue"
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Enhanced Security",
      desc: "Rest assured with our robust security measures. All shortened URLs are protected with advanced encryption.",
      color: "emerald"
    },
    {
      icon: <FaBolt className="text-2xl" />,
      title: "Lightning Fast",
      desc: "Enjoy lightning-fast redirects and high uptime with our reliable infrastructure. Your URLs will always be responsive.",
      color: "amber"
    }
  ];

  const stats = [
    { number: "1k+", label: "Links Created", icon: <FaLink /> },
    { number: "500", label: "Happy Users", icon: <FaUsers /> },
    { number: "1", label: "Countries", icon: <FaGlobe /> },
    { number: "99.9%", label: "Uptime", icon: <FaRocket /> }
  ];

  const team = [
    { name: "Innovation", desc: "We constantly push boundaries to deliver cutting-edge solutions." },
    { name: "Reliability", desc: "Our infrastructure ensures your links are always accessible." },
    { name: "Security", desc: "Your data protection is our top priority." },
    { name: "Simplicity", desc: "Complex technology made simple for everyone." }
  ];

  const colorClasses = {
    rose: "bg-rose-100 text-rose-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600"
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="lg:px-14 sm:px-8 px-4 max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-100 text-sm font-medium text-rose-600 mb-6">
              <HiSparkles className="text-rose-500" />
              About Shortly
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
              Simplifying URL Management for{" "}
              <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">Everyone</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Shortly is a powerful URL shortening platform that helps individuals and businesses create, manage, and track shortened links with ease. Our mission is to make link sharing simple, secure, and insightful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="lg:px-14 sm:px-8 px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl mb-3 text-rose-400">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-white">{stat.number}</h3>
                <p className="text-slate-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:px-14 sm:px-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Why Choose Shortly?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Discover the features that make us the preferred choice for URL management.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${colorClasses[feature.color]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                    <p className="text-slate-600">{feature.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-slate-50 lg:px-14 sm:px-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600">The principles that guide everything we do.</p>
          </motion.div>

          <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6">
            {team.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-slate-100"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{value.name}</h3>
                <p className="text-slate-600 text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:px-14 sm:px-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-rose-500 to-purple-600 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10">
            <FaHeart className="text-4xl text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">Join thousands of users who trust Shortly for their URL management needs.</p>
            <a href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-rose-600 font-semibold rounded-xl hover:bg-slate-100 transition-all shadow-lg hover:scale-105">
              <HiSparkles />
              Start Free Today
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
