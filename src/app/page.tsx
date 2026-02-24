"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plane, ShieldCheck, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const destinations = [
    { name: "Manali", src: "https://images.unsplash.com/photo-1605649487212-4d4ce38d2f5a?q=80&w=800&auto=format&fit=crop" },
    { name: "Ooty", src: "https://images.unsplash.com/photo-1594998499276-84d7fcce55a9?q=80&w=800&auto=format&fit=crop" },
    { name: "Kodaikanal", src: "https://images.unsplash.com/photo-1597871329598-c1fa1878b277?q=80&w=800&auto=format&fit=crop" },
    { name: "Goa", src: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop" },
    { name: "Swiss Alps", src: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 scroll-smooth">
      {/* Navigation */}
      <nav className="fixed w-full z-50 glass py-4 px-8 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-2">
          <Plane className="w-8 h-8 text-emerald-600" />
          <span className="text-2xl font-bold tracking-tighter text-emerald-950">Outbound</span>
        </div>
        <div className="hidden md:flex gap-8 items-center font-medium text-slate-600">
          <Link href="#about" className="hover:text-emerald-600 transition">About</Link>
          <Link href="#destinations" className="hover:text-emerald-600 transition">Destinations</Link>
          <Link href="#features" className="hover:text-emerald-600 transition">Features</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 rounded-full font-medium hover:bg-slate-100 transition">Login</Link>
          <Link href="/request-access" className="bg-emerald-600 text-white px-5 py-2 rounded-full font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition flex items-center gap-2">
            Request Access
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white -z-10" />
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-40 -right-20 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 px-6 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-6 tracking-wide">
              ENTERPRISE TRAVEL TRAINING DASHBOARD
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight text-emerald-950">
              Master Destinations.<br /> <span className="text-gradient">Sell Experiences.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto font-light">
              The premier learning management system exclusively built for high-performance travel sales teams. Elevate your destination knowledge and close more deals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/request-access" className="group bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-2">
                Request Access Today <ArrowRight className="group-hover:translate-x-1 transition" />
              </Link>
              <Link href="/login" className="px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 border border-slate-200 transition-all">
                Corporate Login
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Preview Section */}
      <section id="destinations" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-emerald-950 mb-4">Structured Destination Learning</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Explore comprehensive modules on top domestic and international destinations. Master the intricacies of every locale.</p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          >
            {destinations.map((dest, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-900/20"
              >
                <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-transparent transition duration-300 z-10" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-950/90 to-transparent h-1/2 z-10" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={dest.src} alt={dest.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition">{dest.name}</h3>
                  <div className="h-1 w-0 group-hover:w-12 bg-emerald-400 transition-all duration-300 mt-2 rounded-full" />
                </div>
                <div className="absolute inset-0 border-2 border-emerald-400/0 group-hover:border-emerald-400/50 rounded-2xl transition z-30 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold tracking-tight text-emerald-950 mb-6">Designed exclusively for corporate travel teams.</h2>
              <p className="text-lg text-slate-600 mb-8">Empower your travel executives with a robust LMS featuring sequential video learning, strict quiz evaluations, and powerful team analytics.</p>

              <div className="space-y-8">
                {[
                  { icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />, title: "Certification-ready Paths", desc: "Structured learning with sequential video unlocks and strict quiz completion rules." },
                  { icon: <TrendingUp className="w-8 h-8 text-emerald-600" />, title: "Performance Tracking", desc: "Enterprise dashboards for managers to view team progress and heatmaps." },
                  { icon: <Users className="w-8 h-8 text-emerald-600" />, title: "Role-based Access", desc: "Distinct interfaces for Trainees, Trainers, Managers, and System Admins." }
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1 bg-emerald-50 p-3 rounded-2xl h-fit">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h4>
                      <p className="text-slate-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-3xl blur-2xl opacity-30" />
              <div className="relative glass rounded-3xl p-8 border border-white/50 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800">Team Analytics</h3>
                  <span className="text-emerald-600 text-sm font-semibold bg-emerald-50 px-3 py-1 rounded-full">Live Demo</span>
                </div>
                <div className="space-y-4">
                  {[45, 80, 65, 95].map((val, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 font-medium">Cohort {i + 1}</span>
                        <span className="text-emerald-700 font-bold">{val}% Completed</span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${val}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Luxury CTA */}
      <section className="py-32 relative overflow-hidden bg-emerald-950 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-8">Ready to Elevate Your Team?</h2>
            <p className="text-xl text-emerald-100 mb-12 font-light max-w-2xl mx-auto">
              Join leading outbound travel agencies using our platform to train their sales executives.
            </p>
            <Link href="/request-access" className="bg-white text-emerald-950 px-10 py-5 rounded-full font-bold text-xl hover:bg-emerald-50 shadow-2xl shadow-emerald-500/20 transition-all inline-block hover:scale-105 active:scale-95 duration-200">
              Request Platform Access
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-950 text-emerald-400/60 py-12 text-center text-sm border-t border-emerald-900">
        <p>&copy; {new Date().getFullYear()} Outbound Training Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
