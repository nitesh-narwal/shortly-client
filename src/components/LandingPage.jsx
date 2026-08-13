import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaLink, FaChartLine, FaArrowRight, FaLock,
  FaTag, FaQrcode, FaLayerGroup, FaFileDownload, FaFingerprint, FaClock,
  FaBriefcase, FaCode, FaUsers, FaCheckCircle,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

import Card from "./Card";
import AnimatedCounter from "./AnimatedCounter";
import { useStoreContext } from "../contextApi/ContextApi";

const features = [
  { title: "Instant Shortening", desc: "Turn long URLs into short, collision-safe links in a click.", icon: <FaLink className="text-2xl" />, color: "rose" },
  { title: "Custom Aliases", desc: "Pick your own short code instead of a random one - great for branding.", icon: <FaFingerprint className="text-2xl" />, color: "indigo" },
  { title: "Password Protection", desc: "Gate a link behind a password. The destination stays hidden until unlocked.", icon: <FaLock className="text-2xl" />, color: "purple" },
  { title: "Tags & Favorites", desc: "Organize links with tags, star your favorites, and search instantly.", icon: <FaTag className="text-2xl" />, color: "teal" },
  { title: "Click Analytics", desc: "Daily click trends plus browser, OS, device and referrer breakdowns.", icon: <FaChartLine className="text-2xl" />, color: "blue" },
  { title: "QR Codes", desc: "Every link gets a scannable QR code, ready to download as PNG.", icon: <FaQrcode className="text-2xl" />, color: "amber" },
  { title: "Bulk Operations", desc: "Shorten up to 50 links at once, or bulk-delete in a single action.", icon: <FaLayerGroup className="text-2xl" />, color: "emerald" },
  { title: "One-Time & Expiring Links", desc: "Links that self-destruct after one visit or a set duration.", icon: <FaClock className="text-2xl" />, color: "orange" },
  { title: "CSV Export", desc: "Download all your links and click stats whenever you need them.", icon: <FaFileDownload className="text-2xl" />, color: "sky" },
];

const colorClasses = {
  rose: "from-rose-50 to-rose-100 text-rose-600",
  indigo: "from-indigo-50 to-indigo-100 text-indigo-600",
  purple: "from-purple-50 to-purple-100 text-purple-600",
  teal: "from-teal-50 to-teal-100 text-teal-600",
  blue: "from-blue-50 to-blue-100 text-blue-600",
  amber: "from-amber-50 to-amber-100 text-amber-600",
  emerald: "from-emerald-50 to-emerald-100 text-emerald-600",
  orange: "from-orange-50 to-orange-100 text-orange-600",
  sky: "from-sky-50 to-sky-100 text-sky-600",
};

const steps = [
  { title: "Paste your link", desc: "Drop in any long URL - add a custom alias, tags, expiry, or a password if you like.", icon: <FaLink /> },
  { title: "Get a short link instantly", desc: "We generate a collision-safe short code (or use yours) backed by a real database, not a gimmick.", icon: <HiSparkles /> },
  { title: "Share & track", desc: "Watch clicks roll in with browser, device and referrer breakdowns - all in your dashboard.", icon: <FaChartLine /> },
];

const useCases = [
  { title: "Marketers", desc: "Branded custom-alias links, tags per campaign, and click analytics to prove what's working.", icon: <FaBriefcase /> },
  { title: "Developers", desc: "A real REST API with JWT auth, bulk endpoints, and OpenAPI docs - script it, don't click it.", icon: <FaCode /> },
  { title: "Teams", desc: "Password-protect sensitive links, expire them automatically, export everything to CSV.", icon: <FaUsers /> },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { token } = useStoreContext();
  const [demoUrl, setDemoUrl] = useState("");

  const dashBoardNavigateHandler = () => {
    navigate(token ? "/dashboard" : "/register");
  };

  const handleDemoSubmit = (e) => {
    e.preventDefault();
    if (!demoUrl.trim()) return;
    sessionStorage.setItem("shortly_prefill_url", demoUrl.trim());
    navigate(token ? "/dashboard" : "/register");
  };

  return (
    <div className="overflow-hidden">
      {/* ============ HERO ============ */}
      <div className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50">
        {/* Decorative background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 -right-20 w-[28rem] h-[28rem] bg-purple-300/20 rounded-full blur-3xl"
        />

        <div className="relative lg:px-14 sm:px-8 px-4 max-w-7xl mx-auto">
          <div className="lg:flex-row flex-col lg:py-20 pt-16 pb-12 lg:gap-16 gap-10 flex justify-between items-center">
            <div className="flex-1 w-full">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-block mb-4"
              >
                <span className="bg-gradient-to-r from-rose-100 to-purple-100 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold">
                  🚀 Fast, Secure & Insightful URL Shortener
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="font-bold font-roboto text-slate-800 md:text-6xl sm:text-5xl text-4xl md:leading-[70px] sm:leading-[55px] leading-[45px] w-full mb-6"
              >
                Shorten links. Protect them.{" "}
                <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                  Watch every click.
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-slate-600 text-base leading-relaxed mb-8 lg:w-[90%]"
              >
                Custom aliases, password-protected links, tags, QR codes, and click
                analytics broken down by browser, device and referrer - all in one clean
                dashboard.
              </motion.p>

              {/* Live demo box */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                onSubmit={handleDemoSubmit}
                className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 p-2 flex sm:flex-row flex-col gap-2 mb-4"
              >
                <div className="flex items-center flex-1 px-3">
                  <FaLink className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="Paste a long URL to shorten it..."
                    className="w-full px-3 py-3 outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 shrink-0"
                >
                  Shorten It
                  <FaArrowRight className="text-sm" />
                </button>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500"
              >
                <span className="flex items-center gap-1.5"><FaCheckCircle className="text-emerald-500" /> Free to start</span>
                <span className="flex items-center gap-1.5"><FaCheckCircle className="text-emerald-500" /> No credit card required</span>
                <span className="flex items-center gap-1.5"><FaCheckCircle className="text-emerald-500" /> Cancel anytime</span>
              </motion.div>
            </div>

            {/* Product preview mockup */}
            <div className="flex-1 flex justify-center w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative w-full max-w-md"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-purple-500 rounded-2xl blur-3xl opacity-20" />
                <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                  {/* fake browser chrome */}
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-50 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="ml-3 text-xs text-slate-400 font-mono">shortly.app/dashboard</span>
                  </div>

                  <div className="p-5 space-y-3">
                    {[
                      { code: "shortly.app/launch", clicks: 482, tag: "marketing", locked: false },
                      { code: "shortly.app/vip-invite", clicks: 91, tag: "team", locked: true },
                      { code: "shortly.app/q3-report", clicks: 217, tag: "docs", locked: false },
                    ].map((row) => (
                      <motion.div
                        key={row.code}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + Math.random() * 0.3, duration: 0.5 }}
                        className="flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate flex items-center gap-1.5">
                            {row.code}
                            {row.locked && <FaLock className="text-[10px] text-rose-500 shrink-0" />}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-medium px-2 py-0.5 bg-teal-100 text-teal-700 rounded-full">
                            {row.tag}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm shrink-0">
                          <FaChartLine className="text-xs" />
                          {row.clicks}
                        </div>
                      </motion.div>
                    ))}

                    <div className="pt-2">
                      <div className="h-16 flex items-end gap-1.5">
                        {[40, 65, 35, 80, 55, 95, 70].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: 0.8 + i * 0.08, duration: 0.5 }}
                            className="flex-1 bg-gradient-to-t from-rose-400 to-purple-400 rounded-t-md"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ STATS BAND ============ */}
      <div className="py-14 bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900">
        <div className="lg:px-14 sm:px-8 px-4 max-w-7xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8 text-center">
          {[
            { value: 1000, suffix: "+", label: "Links Created" },
            { value: 500, suffix: "", label: "Active Users" },
            { value: 99.9, suffix: "%", label: "Uptime" },
            { value: 10, suffix: "min", label: "Cached Redirect TTL" },
          ].map((stat) => (
            <div key={stat.label}>
              <h3 className="text-4xl font-bold text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </h3>
              <p className="text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:px-14 sm:px-8 px-4 max-w-7xl mx-auto bg-gradient-to-b from-white via-slate-50 to-white">
        {/* ============ HOW IT WORKS ============ */}
        <div className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-rose-600 font-semibold text-sm uppercase tracking-wide mb-2 block">How It Works</span>
            <h2 className="text-slate-800 font-roboto font-bold text-4xl">Three steps. That's it.</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-purple-600 text-white flex items-center justify-center text-2xl mb-5 shadow-lg shadow-rose-500/25">
                  {step.icon}
                </div>
                <span className="absolute top-4 right-6 text-5xl font-black text-slate-50">0{index + 1}</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2 relative">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed relative">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ============ FEATURES ============ */}
        <div className="sm:pt-8 pt-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <span className="text-rose-600 font-semibold text-sm uppercase tracking-wide mb-2 block">
              Everything You Need
            </span>
            <h2 className="text-slate-800 font-roboto font-bold lg:w-[60%] md:w-[70%] sm:w-[80%] mx-auto text-4xl">
              A URL shortener that actually does the job
            </h2>
          </motion.div>

          <div className="grid lg:gap-6 gap-5 xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
              >
                <Card
                  title={feature.title}
                  desc={feature.desc}
                  icon={
                    <span className={`bg-gradient-to-br ${colorClasses[feature.color]} rounded-xl w-full h-full flex items-center justify-center`}>
                      {feature.icon}
                    </span>
                  }
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ============ USE CASES ============ */}
        <div className="pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-rose-600 font-semibold text-sm uppercase tracking-wide mb-2 block">Built For</span>
            <h2 className="text-slate-800 font-roboto font-bold text-4xl">Whoever's sharing the link</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {useCases.map((uc, index) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl mb-5 relative">
                  {uc.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 relative">{uc.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed relative">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ============ CTA ============ */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-r from-rose-500 to-purple-600 rounded-2xl p-12 text-center mb-16 shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative">
            <h2 className="text-white font-bold text-3xl mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust Shortly for their URL shortening needs.
              Start creating and managing your short links today!
            </p>
            <button
              onClick={dashBoardNavigateHandler}
              className="bg-white text-rose-600 px-8 py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5 inline-flex items-center gap-2"
            >
              {token ? "Go to Dashboard" : "Sign Up Now"}
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
