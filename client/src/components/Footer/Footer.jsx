import React from 'react';
import { Sparkles, Twitter, Github, Linkedin, Instagram, Mail, Heart } from 'lucide-react';
import Container from '../Container/Container';

// Helper to format external URLs correctly
const formatExternalUrl = (url) => {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#') return '#';
  if (/^(https?:\/\/|mailto:|tel:|\/\/)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const Footer = ({ socialLinks = {} }) => {
  const currentYear = new Date().getFullYear();

  const socials = [
    {
      icon: Twitter,
      href: socialLinks.twitter || 'https://x.com',
      label: 'Twitter',
    },
    {
      icon: Linkedin,
      href: socialLinks.linkedin || 'https://linkedin.com',
      label: 'LinkedIn',
    },
    {
      icon: Github,
      href: socialLinks.github || 'https://github.com',
      label: 'GitHub',
    },
    {
      icon: Instagram,
      href: socialLinks.instagram || 'https://instagram.com',
      label: 'Instagram',
    },
  ];

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#home" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                InternConnect <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Launch your career with AI-powered internship discovery. We bridge the gap between talented university students and leading global tech employers.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              {socials.map((social) => {
                const IconComponent = social.icon;
                const finalHref = formatExternalUrl(social.href);
                const isExternal = finalHref !== '#';

                return (
                  <a
                    key={social.label}
                    href={finalHref}
                    aria-label={social.label}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (!isExternal) {
                        e.preventDefault();
                      }
                    }}
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-200"
                  >
                    <IconComponent className="w-4 h-4 pointer-events-none" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#home" className="hover:text-indigo-400 transition-colors">Home</a></li>
              <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
              <li><a href="#categories" className="hover:text-indigo-400 transition-colors">Categories</a></li>
              <li><a href="#companies" className="hover:text-indigo-400 transition-colors">Top Companies</a></li>
              <li><a href="#testimonials" className="hover:text-indigo-400 transition-colors">Testimonials</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#about" className="hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#career" className="hover:text-indigo-400 transition-colors">Career Advice</a></li>
              <li><a href="#resume" className="hover:text-indigo-400 transition-colors">AI Resume Checker</a></li>
              <li><a href="#contact" className="hover:text-indigo-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Legal & Compliance Column */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#cookie" className="hover:text-indigo-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#security" className="hover:text-indigo-400 transition-colors">Security Overview</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} InternConnect AI. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for ambitious students worldwide.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
