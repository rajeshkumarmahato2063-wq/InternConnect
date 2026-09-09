import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Building2, Briefcase, Award } from 'lucide-react';
import Container from '../Container/Container';

// Custom animated counter subcomponent
const CounterNumber = ({ target, suffix = '', duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = parseInt(target.replace(/,/g, ''), 10);
    if (isNaN(end)) return;

    const totalSteps = 60;
    const increment = Math.max(1, Math.floor(end / totalSteps));
    const stepTime = (duration * 1000) / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Stats = () => {
  const statsList = [
    {
      id: 'students',
      label: 'Active Students',
      target: '10,000',
      suffix: '+',
      icon: Users,
      color: 'from-blue-400 to-indigo-400',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      description: 'Engaged candidate pool across 200+ universities',
    },
    {
      id: 'companies',
      label: 'Partner Companies',
      target: '500',
      suffix: '+',
      icon: Building2,
      color: 'from-indigo-400 to-purple-400',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      description: 'Startups, unicorns & Fortune 500 tech leaders',
    },
    {
      id: 'internships',
      label: 'Live Internships',
      target: '2,500',
      suffix: '+',
      icon: Briefcase,
      color: 'from-purple-400 to-pink-400',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      description: 'Verified remote & on-site internship listings',
    },
    {
      id: 'success-rate',
      label: 'Placement Success',
      target: '95',
      suffix: '%',
      icon: Award,
      color: 'from-emerald-400 to-teal-400',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: 'Students receiving verified offer letters',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Subtle Gradient Bar */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-indigo-900/30 to-purple-900/20 backdrop-blur-3xl -z-10 border-y border-white/5" />

      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsList.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="rounded-2xl p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.iconBg} border flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Verified
                  </span>
                </div>

                <div>
                  <h3 className={`text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} tracking-tight mb-1`}>
                    <CounterNumber target={stat.target} suffix={stat.suffix} />
                  </h3>
                  <p className="text-white font-bold text-base mb-1">{stat.label}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{stat.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Stats;
