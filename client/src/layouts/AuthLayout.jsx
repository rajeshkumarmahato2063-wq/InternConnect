import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/Container/Container';

const AuthLayout = ({ children, title, subtitle, backLink = '/' }) => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-10 right-10 w-80 h-80 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Header Bar */}
      <header className="py-6 border-b border-white/5">
        <Container>
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300 border border-indigo-400/30">
                <Sparkles className="w-5 h-5 text-white animate-pulse-slow" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white font-sans">
                InternConnect <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
              </span>
            </Link>

            <Link
              to={backLink}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Form Center Wrapper */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          {title && (
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{title}</h1>
              {subtitle && <p className="text-slate-400 text-sm mt-2">{subtitle}</p>}
            </div>
          )}

          {/* Form Card Container */}
          <div className="rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 shadow-2xl shadow-black/60 relative overflow-hidden">
            {children}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-white/5 text-center text-xs text-slate-500">
        <Container>
          <p>© {new Date().getFullYear()} InternConnect AI. All rights reserved. • Protected with JWT Authentication</p>
        </Container>
      </footer>
    </div>
  );
};

export default AuthLayout;
