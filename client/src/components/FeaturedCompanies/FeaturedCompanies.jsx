import React from 'react';
import { motion } from 'framer-motion';
import Container from '../Container/Container';
import Card from '../Card/Card';

const FeaturedCompanies = () => {
  // Company data with custom clean logos/icons
  const companies = [
    {
      name: 'Google',
      roles: '120+ Openings',
      color: 'from-blue-500 to-red-500',
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      ),
    },
    {
      name: 'Microsoft',
      roles: '95+ Openings',
      color: 'from-blue-600 to-indigo-600',
      logo: (
        <svg className="w-8 h-8" viewBox="0 0 23 23">
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
      ),
    },
    {
      name: 'Amazon',
      roles: '150+ Openings',
      color: 'from-amber-500 to-orange-600',
      logo: (
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-black text-amber-400 text-xl tracking-tighter">
          a
        </div>
      ),
    },
    {
      name: 'Infosys',
      roles: '200+ Openings',
      color: 'from-blue-400 to-cyan-500',
      logo: (
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-xs">
          INF
        </div>
      ),
    },
    {
      name: 'TCS',
      roles: '300+ Openings',
      color: 'from-purple-500 to-indigo-600',
      logo: (
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400 text-xs">
          TCS
        </div>
      ),
    },
    {
      name: 'Wipro',
      roles: '180+ Openings',
      color: 'from-teal-400 to-emerald-500',
      logo: (
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs">
          WIP
        </div>
      ),
    },
  ];

  return (
    <section id="companies" className="py-20 relative overflow-hidden">
      <Container>
        {/* Section Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-semibold mb-2">
            Top Hiring Partners
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white">
            Trusted by World-Class Tech Giants & Enterprises
          </h3>
          <p className="text-slate-400 text-sm mt-2">
            Join thousands of students interning at global innovators.
          </p>
        </div>

        {/* Company Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Card
                variant="glass"
                hoverable
                className="h-full flex flex-col items-center justify-center p-6 text-center border-slate-800 hover:border-indigo-500/40 group transition-all duration-300"
              >
                <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                  {company.logo}
                </div>
                <h4 className="text-white font-bold text-base tracking-wide group-hover:text-indigo-300 transition-colors">
                  {company.name}
                </h4>
                <span className="mt-1 text-[11px] font-medium text-slate-400 group-hover:text-indigo-400 transition-colors">
                  {company.roles}
                </span>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturedCompanies;
