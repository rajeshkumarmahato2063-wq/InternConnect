import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Container from '../Container/Container';

const FeaturedCompanies = () => {
  // Statistics data
  const stats = [
    {
      value: '500+',
      label: 'Partner Companies',
      description: 'Hiring active interns',
    },
    {
      value: '25,000+',
      label: 'Students Placed',
      description: 'Across global tech hubs',
    },
    {
      value: '95%',
      label: 'Internship Success Rate',
      description: 'Offer conversion after trial',
    },
  ];

  // Company data with 56px SVG logos and specific opening counts
  const companies = [
    {
      name: 'Google',
      openings: '120+ Openings',
      tagline: 'Mountain View, CA • Remote',
      color: 'from-blue-500/20 to-emerald-500/20',
      logo: (
        <svg
          className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Google logo"
        >
          <title>Google</title>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      ),
    },
    {
      name: 'Microsoft',
      openings: '95+ Openings',
      tagline: 'Redmond, WA • Hybrid',
      color: 'from-blue-600/20 to-indigo-600/20',
      logo: (
        <svg
          className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          role="img"
          aria-label="Microsoft logo"
        >
          <title>Microsoft</title>
          <path fill="#F25022" d="M2 2h9v9H2z" />
          <path fill="#7FBA00" d="M13 2h9v9H13z" />
          <path fill="#00A4EF" d="M2 13h9v9H2z" />
          <path fill="#FFB900" d="M13 13h9v9H13z" />
        </svg>
      ),
    },
    {
      name: 'Amazon',
      openings: '150+ Openings',
      tagline: 'Seattle, WA • Global',
      color: 'from-amber-500/20 to-orange-500/20',
      logo: (
        <svg
          className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          role="img"
          aria-label="Amazon logo"
        >
          <title>Amazon</title>
          <path
            d="M13.9 14.7c-.8.6-1.9.9-3 .9-2.3 0-3.9-1.4-3.9-3.7 0-2.5 1.9-3.8 4.4-3.8.9 0 1.8.2 2.5.5v-.4c0-1.4-.9-2.2-2.3-2.2-1.1 0-2 .4-2.7.9l-.7-1.1c1-.8 2.2-1.3 3.7-1.3 2.3 0 3.8 1.3 3.8 3.6v4.6c0 .7.1 1.4.3 1.9h-1.8l-.3-1zm-.1-4c-.6-.3-1.3-.5-2.1-.5-1.5 0-2.6.8-2.6 2.3 0 1.4 1 2.2 2.3 2.2.8 0 1.6-.3 2.1-.8l.3-3.2z"
            fill="#F59E0B"
          />
          <path
            d="M21.7 18.6c-2.4 1.8-5.8 2.7-9.3 2.7-4.4 0-8.5-1.5-11.4-4-.2-.2-.2-.5.1-.7.2-.2.6-.1.8.1 2.7 2.3 6.5 3.7 10.5 3.7 3.2 0 6.3-.8 8.5-2.4.3-.2.7-.1.9.2.2.3.1.6-.1.9z"
            fill="#F59E0B"
          />
          <path
            d="M22.5 17.5c-.3-.4-1.9-.3-2.9-.1-.3 0-.4-.3-.1-.5 1.5-1 3.5-.4 3.8-.1.3.4-.1 2.4-1.5 3.5-.3.2-.5.1-.4-.2.4-.8 1.4-2.2 1.1-2.6z"
            fill="#F59E0B"
          />
        </svg>
      ),
    },
    {
      name: 'Infosys',
      openings: '200+ Openings',
      tagline: 'Bangalore, IN • Global',
      color: 'from-blue-400/20 to-cyan-500/20',
      logo: (
        <svg
          className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          role="img"
          aria-label="Infosys logo"
        >
          <title>Infosys</title>
          <rect width="24" height="24" rx="7" fill="#007CC3" fillOpacity="0.16" />
          <path
            d="M5.5 16.5V7.5H7.5V16.5H5.5ZM10 16.5V11H12V12.2C12.5 11.4 13.5 10.8 14.8 10.8C16.8 10.8 18 12.1 18 14.2V16.5H16V14.4C16 13.1 15.3 12.5 14.2 12.5C13 12.5 12 13.3 12 14.8V16.5H10Z"
            fill="#007CC3"
          />
          <circle cx="6.5" cy="5.2" r="1.2" fill="#007CC3" />
        </svg>
      ),
    },
    {
      name: 'TCS',
      openings: '300+ Openings',
      tagline: 'Mumbai, IN • Global',
      color: 'from-purple-500/20 to-pink-500/20',
      logo: (
        <svg
          className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          role="img"
          aria-label="TCS logo"
        >
          <title>TCS</title>
          <defs>
            <linearGradient id="tcsLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E6007E" />
              <stop offset="50%" stopColor="#8A2BE2" />
              <stop offset="100%" stopColor="#00A4EF" />
            </linearGradient>
          </defs>
          <rect
            width="24"
            height="24"
            rx="7"
            fill="url(#tcsLogoGrad)"
            fillOpacity="0.14"
            stroke="url(#tcsLogoGrad)"
            strokeWidth="0.8"
          />
          <text
            x="12"
            y="14.8"
            textAnchor="middle"
            fill="#FFFFFF"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontWeight="900"
            fontSize="8"
            letterSpacing="0.6"
          >
            TCS
          </text>
          <path
            d="M5 18.5C8.5 19.5 15.5 19.5 19 18.5"
            stroke="url(#tcsLogoGrad)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      name: 'Wipro',
      openings: '180+ Openings',
      tagline: 'Bangalore, IN • Global',
      color: 'from-emerald-400/20 to-teal-500/20',
      logo: (
        <svg
          className="w-14 h-14 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="none"
          role="img"
          aria-label="Wipro logo"
        >
          <title>Wipro</title>
          <circle cx="12" cy="12" r="3" fill="#FFFFFF" />
          <circle cx="12" cy="4.5" r="1.8" fill="#E2231A" />
          <circle cx="17.3" cy="6.7" r="1.8" fill="#F39200" />
          <circle cx="19.5" cy="12" r="1.8" fill="#FFD100" />
          <circle cx="17.3" cy="17.3" r="1.8" fill="#95C11E" />
          <circle cx="12" cy="19.5" r="1.8" fill="#009640" />
          <circle cx="6.7" cy="17.3" r="1.8" fill="#009EE0" />
          <circle cx="4.5" cy="12" r="1.8" fill="#005A9C" />
          <circle cx="6.7" cy="6.7" r="1.8" fill="#7C2A83" />
        </svg>
      ),
    },
  ];

  // Marquee company roster for continuous ribbon
  const marqueeLogos = [
    { name: 'Google', symbol: 'G', color: 'text-blue-400' },
    { name: 'Microsoft', symbol: 'MS', color: 'text-cyan-400' },
    { name: 'Amazon', symbol: 'AMZN', color: 'text-amber-400' },
    { name: 'Meta', symbol: '∞', color: 'text-blue-500' },
    { name: 'Apple', symbol: '', color: 'text-slate-200' },
    { name: 'Netflix', symbol: 'N', color: 'text-red-500' },
    { name: 'Infosys', symbol: 'INF', color: 'text-sky-400' },
    { name: 'TCS', symbol: 'TCS', color: 'text-fuchsia-400' },
    { name: 'Wipro', symbol: 'WIP', color: 'text-emerald-400' },
    { name: 'IBM', symbol: 'IBM', color: 'text-blue-300' },
    { name: 'Oracle', symbol: 'ORCL', color: 'text-red-400' },
    { name: 'Adobe', symbol: 'Ai', color: 'text-rose-400' },
    { name: 'Intel', symbol: 'INTC', color: 'text-indigo-400' },
    { name: 'Uber', symbol: 'UBER', color: 'text-slate-100' },
  ];

  return (
    <section
      id="companies"
      aria-labelledby="companies-heading"
      className="relative py-20 sm:py-24 bg-[#020817] text-slate-100 overflow-hidden"
    >
      {/* Background Decorative Ambient Gradients (Stripe / Vercel style) */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl opacity-70"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25"
        aria-hidden="true"
      />

      <Container className="relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Top Hiring Partners
          </div>

          <h2
            id="companies-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight"
          >
            Trusted by World-Class Tech Giants & Enterprises
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Discover verified internship roles at high-growth startups and Fortune 500 innovators
            actively recruiting on InternConnect.
          </p>
        </div>

        {/* 1. Statistics Row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 rounded-3xl bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((stat, idx) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center ${
                  idx !== 0 ? 'pt-4 md:pt-0' : ''
                }`}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                  {stat.value}
                </div>
                <div className="mt-1 text-base font-bold text-white tracking-wide">
                  {stat.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{stat.description}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 2. Responsive CSS Grid of 6 Featured Companies */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="h-full"
            >
              <div
                tabIndex={0}
                role="article"
                aria-label={`${company.name} hiring with ${company.openings}`}
                className="group relative h-full flex flex-col items-center justify-center p-6 sm:p-7 text-center rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-white/10 hover:border-blue-500/60 transition-all duration-300 ease-out hover:scale-105 hover:shadow-[0_0_35px_rgba(59,130,246,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817] cursor-pointer overflow-hidden"
              >
                {/* Subtle Inner Glow on Hover */}
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${company.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  aria-hidden="true"
                />

                {/* 56px Company Logo */}
                <div className="relative mb-4 flex items-center justify-center w-14 h-14">
                  {company.logo}
                </div>

                {/* Company Name */}
                <h3 className="relative text-lg font-bold text-white tracking-wide group-hover:text-blue-300 transition-colors duration-200">
                  {company.name}
                </h3>

                {/* Openings Pill with Pulsing Live Dot */}
                <div className="relative mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/20 group-hover:border-blue-500/40 group-hover:bg-blue-500/20 transition-all duration-200 shadow-sm">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                    aria-hidden="true"
                  />
                  <span>{company.openings}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3. Infinite Scrolling Marquee of Company Logos */}
        <div className="mt-16 sm:mt-20 pt-10 border-t border-white/5">
          <p className="text-center text-xs uppercase tracking-widest text-slate-500 font-semibold mb-6">
            Accelerating Careers Across 500+ Industry Leaders
          </p>

          <div
            className="relative w-full overflow-hidden py-4 select-none"
            aria-label="Partner company logo marquee"
          >
            {/* Left & Right Gradient Fade Masks */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-36 bg-gradient-to-r from-[#020817] via-[#020817]/90 to-transparent z-10"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-36 bg-gradient-to-l from-[#020817] via-[#020817]/90 to-transparent z-10"
              aria-hidden="true"
            />

            {/* Seamless Infinite Marquee Track */}
            <div className="flex animate-marquee w-max gap-4 sm:gap-6">
              {[...marqueeLogos, ...marqueeLogos].map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className="flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-blue-500/30 transition-all duration-200 text-slate-300 hover:text-white"
                >
                  <span
                    className={`font-mono text-xs sm:text-sm font-black px-1.5 py-0.5 rounded bg-white/5 ${item.color}`}
                  >
                    {item.symbol}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Call to Action (CTA) Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="relative inline-block max-w-3xl mx-auto p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl">
            {/* Ambient Backlight for CTA */}
            <div
              className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-32 bg-blue-500/20 blur-2xl rounded-full"
              aria-hidden="true"
            />

            <h3 className="relative text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Ready to Land Your Dream Internship?
            </h3>
            <p className="relative mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Build your verified profile, take skill verification challenges, and get discovered by
              top recruiters worldwide.
            </p>

            <div className="relative mt-7 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-sm sm:text-base bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:shadow-[0_0_45px_rgba(99,102,241,0.7)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817]"
              >
                <span>Explore Open Internships</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              <Link
                to="/auth/student/register"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-slate-300 hover:text-white text-sm sm:text-base bg-slate-800/60 hover:bg-slate-800 border border-white/10 hover:border-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020817]"
              >
                <span>Create Student Account</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default FeaturedCompanies;
