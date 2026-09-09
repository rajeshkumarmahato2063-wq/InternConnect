import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Sparkles, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Container from '../components/Container/Container';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <Container>
          <div className="max-w-2xl mx-auto text-center space-y-8 relative z-10">
            {/* 404 Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-widest shadow-inner"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>404 — Page Not Found</span>
            </motion.div>

            {/* Title & Message */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h1 className="text-6xl sm:text-7xl font-extrabold text-white tracking-tight">
                Lost in the{' '}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  Internverse?
                </span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                The page or internship listing you are looking for has been moved, archived, or does not exist on this route.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                to="/explore"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <Compass className="w-4 h-4" />
                <span>Explore Live Internships</span>
              </Link>

              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-bold text-xs transition-all flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Return to Homepage</span>
              </Link>
            </motion.div>
          </div>
        </Container>
      </div>
    </MainLayout>
  );
}
