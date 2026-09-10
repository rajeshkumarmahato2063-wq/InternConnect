import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Container from '../Container/Container';
import Button from '../Button/Button';
import Badge from '../Badge/Badge';
import { useAuth } from '../../context/AuthContext';

const CTA = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role, user } = useAuth();
  const [navigating, setNavigating] = useState(false);

  const handleStartJourney = (e) => {
    e.preventDefault();
    setNavigating(true);

    setTimeout(() => {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (role === 'student' || user?.role === 'student') {
        navigate('/student/dashboard');
      } else if (role === 'company' || user?.role === 'company') {
        navigate('/company/dashboard');
      } else if (role === 'admin' || user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/login');
      }
      setNavigating(false);
    }, 150);
  };

  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <Container>
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-blue-900/80 via-indigo-900/90 to-purple-900/80 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/80 overflow-hidden text-center">
          
          {/* Floating Background Effects */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl pointer-events-none animate-pulse-slow" />
          
          {/* Subtle Star Particles */}
          <div className="absolute top-6 left-12 text-indigo-400/40 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-8 right-16 text-purple-400/40 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            {/* Badge */}
            <Badge variant="accent" icon={Rocket} className="mb-6 py-1.5 px-4">
              Get Instant Access
            </Badge>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Ready to Find Your{' '}
              <span className="bg-gradient-to-r from-blue-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                Dream Internship?
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-indigo-100/80 max-w-xl mb-8 leading-relaxed font-normal">
              Create your profile in under 2 minutes. Let our AI algorithms match your skills directly with recruiters from top global tech companies.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-20 relative">
              <Button
                variant="primary"
                size="lg"
                icon={navigating ? Loader2 : ArrowRight}
                iconPosition="right"
                onClick={handleStartJourney}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleStartJourney(e);
                }}
                disabled={navigating}
                className="w-full sm:w-auto shadow-2xl shadow-indigo-500/50 active:scale-95 transition-transform"
              >
                {navigating ? 'Navigating...' : 'Start Your Journey'}
              </Button>
            </div>

            {/* Micro details */}
            <p className="text-xs text-indigo-200/60 mt-6 flex items-center gap-4">
              <span>✓ Free for all students</span>
              <span>•</span>
              <span>✓ Instant resume score</span>
              <span>•</span>
              <span>✓ No credit card required</span>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
