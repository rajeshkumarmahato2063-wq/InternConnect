import React from 'react';
import { motion } from 'framer-motion';
import { Code, Brain, Database, Shield, Smartphone, Cloud, ArrowUpRight } from 'lucide-react';
import Container from '../Container/Container';
import SectionTitle from '../SectionTitle/SectionTitle';
import Card from '../Card/Card';

const Categories = () => {
  const categories = [
    {
      id: 'web-dev',
      title: 'Web Development',
      description: 'Master React, Next.js, Node.js, and modern full-stack architectures with top startups.',
      icon: Code,
      openings: '850+ Openings',
      color: 'from-blue-500 to-indigo-500',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      tag: 'Trending',
    },
    {
      id: 'ai-ml',
      title: 'AI & Machine Learning',
      description: 'Build LLMs, neural networks, computer vision, and predictive AI models.',
      icon: Brain,
      openings: '620+ Openings',
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      tag: 'High Demand',
    },
    {
      id: 'data-science',
      title: 'Data Science',
      description: 'Analyze big data pipelines, Python data models, SQL analytics, and visualization dashboards.',
      icon: Database,
      openings: '490+ Openings',
      color: 'from-emerald-500 to-teal-500',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      tag: 'Featured',
    },
    {
      id: 'cyber-security',
      title: 'Cyber Security',
      description: 'Ethical hacking, penetration testing, threat detection, and cloud security compliance.',
      icon: Shield,
      openings: '310+ Openings',
      color: 'from-red-500 to-amber-500',
      iconBg: 'bg-red-500/10 text-red-400 border-red-500/30',
      tag: 'Critical',
    },
    {
      id: 'mobile-dev',
      title: 'Mobile Development',
      description: 'Craft high-performance iOS and Android applications using Flutter, React Native & Swift.',
      icon: Smartphone,
      openings: '410+ Openings',
      color: 'from-indigo-500 to-cyan-500',
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      tag: 'Popular',
    },
    {
      id: 'cloud-computing',
      title: 'Cloud Computing',
      description: 'Deploy resilient microservices, Kubernetes clusters, AWS & DevOps pipelines.',
      icon: Cloud,
      openings: '380+ Openings',
      color: 'from-sky-500 to-blue-600',
      iconBg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      tag: 'Enterprise',
    },
  ];

  return (
    <section id="categories" className="py-24 relative overflow-hidden bg-slate-950/40">
      <Container>
        <SectionTitle
          badgeText="Explore Domains"
          title="Browse Internships by"
          gradientTitle="High-Impact Categories"
          subtitle="Explore specialized roles tailored to your tech stack and career aspirations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, index) => {
            const IconComponent = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  variant="glass"
                  hoverable
                  className="h-full flex flex-col justify-between group border-slate-800 hover:border-indigo-500/50 p-6 sm:p-8"
                >
                  <div>
                    {/* Top Row: Icon & Tag */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${cat.iconBg} border flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                        {cat.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors mb-3 flex items-center justify-between">
                      {cat.title}
                      <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all text-indigo-400" />
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                      {cat.description}
                    </p>
                  </div>

                  {/* Footer: Openings count */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-indigo-400 font-semibold">{cat.openings}</span>
                    <span className="text-slate-400 group-hover:text-white transition-colors">View All Opportunities &rarr;</span>
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

export default Categories;
