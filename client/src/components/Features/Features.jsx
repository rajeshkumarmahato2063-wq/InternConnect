import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Zap, LineChart, Award, Users, ArrowUpRight } from 'lucide-react';
import Container from '../Container/Container';
import SectionTitle from '../SectionTitle/SectionTitle';
import Card from '../Card/Card';

const Features = () => {
  const featureList = [
    {
      id: 'ai-matching',
      title: 'AI Smart Skill Matching',
      description: 'Algorithmically evaluates candidate skill sets against live internship requirements with 98% matching accuracy.',
      icon: Cpu,
      color: 'from-blue-500 to-indigo-500',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      badge: 'Core Engine',
    },
    {
      id: 'ats-resume',
      title: 'Automated ATS Resume Analyzer',
      description: 'Get instant structural, keyword, and formatting feedback tailored to top tier tech recruiters.',
      icon: ShieldCheck,
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      badge: 'Instant Feedback',
    },
    {
      id: 'skill-challenges',
      title: 'Verified Skill Challenges',
      description: 'Complete hands-on coding and analytical challenges to earn verified badges visible to employer hiring managers.',
      icon: Zap,
      color: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badge: 'Skill Verification',
    },
    {
      id: 'recruiter-pipeline',
      title: 'Direct Recruiter Referrals',
      description: 'Bypass traditional application black holes. Top scoring profiles get directly pushed to hiring leads.',
      icon: LineChart,
      color: 'from-amber-500 to-orange-500',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      badge: 'Direct Pipeline',
    },
    {
      id: 'real-time-tracking',
      title: 'Real-Time Application Status',
      description: 'Track your application status live from initial screening, interview scheduling, to official offer letter.',
      icon: Award,
      color: 'from-cyan-500 to-blue-600',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      badge: 'Live Status',
    },
    {
      id: 'portfolio-generator',
      title: '1-Click Portfolio Builder',
      description: 'Generate an ultra-sleek, shareable web portfolio showcasing your projects, certificates, and verified scores.',
      icon: Users,
      color: 'from-indigo-500 to-purple-500',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      badge: 'Shareable Web Portfolio',
    },
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-slate-950/60 border-t border-b border-slate-900">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container>
        <SectionTitle
          badgeText="Next-Gen Architecture"
          title="Engineered for"
          gradientTitle="Accelerated Career Growth"
          subtitle="Everything candidates and employers need to discover, evaluate, and land top tech internships."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featureList.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <Card
                  variant="glass"
                  hoverable
                  className="h-full flex flex-col justify-between group border-slate-800 hover:border-indigo-500/50 p-6 sm:p-8 relative overflow-hidden"
                >
                  <div>
                    {/* Top Row: Icon & Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${item.iconBg} border flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-900 text-indigo-300 border border-indigo-500/30">
                        {item.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-3 flex items-center justify-between">
                      {item.title}
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all text-indigo-400" />
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default Features;
