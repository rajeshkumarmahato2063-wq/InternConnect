import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, GraduationCap, Building } from 'lucide-react';
import Container from '../Container/Container';
import SectionTitle from '../SectionTitle/SectionTitle';
import Card from '../Card/Card';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Aarav Sharma',
      role: 'Full Stack Engineering Intern',
      company: 'Microsoft',
      college: 'IIT Delhi (Batch of 2025)',
      rating: 5,
      quote:
        'InternConnect AI matched my exact GitHub tech stack with Microsoft’s campus referral program. The automated resume score feedback gave me the confidence to ace my technical rounds!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      initials: 'AS',
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      id: 2,
      name: 'Ananya Verma',
      role: 'AI Research Intern',
      company: 'Google DeepMind',
      college: 'BITS Pilani',
      rating: 5,
      quote:
        'I landed my dream AI research internship within 2 weeks! The personalized recommendations saved me hundreds of hours of manual job hunting. Truly a game-changer.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      initials: 'AV',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      name: 'Rohan Patel',
      role: 'Cloud Security Intern',
      company: 'Amazon Web Services',
      college: 'NIT Trichy',
      rating: 5,
      quote:
        'The glassmorphic dashboard, real-time application status, and skill-gap suggestions helped me upskill in AWS Kubernetes right before my interview. Received a high-paying offer letter!',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      initials: 'RP',
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-slate-950/60">
      <Container>
        <SectionTitle
          badgeText="Student Success Stories"
          title="Loved by 10,000+ Students Across"
          gradientTitle="Top Universities"
          subtitle="Discover how ambitious engineering and design students accelerated their career journey with InternConnect AI."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
            >
              <Card
                variant="glass"
                hoverable
                className="h-full flex flex-col justify-between border-slate-800 hover:border-indigo-500/50 p-6 sm:p-8 relative group"
              >
                <div>
                  {/* Rating Stars & Quote Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-1">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="w-8 h-8 text-indigo-500/30 group-hover:text-indigo-400/50 transition-colors" />
                  </div>

                  {/* Quote Body */}
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed italic mb-8">
                    "{item.quote}"
                  </p>
                </div>

                {/* Author Info Footer */}
                <div className="pt-6 border-t border-slate-800 flex items-center gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${item.gradient} p-0.5 shadow-lg`}>
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-full h-full rounded-full object-cover bg-slate-900"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-full h-full rounded-full bg-slate-900 items-center justify-center text-white font-bold text-sm">
                        {item.initials}
                      </div>
                    </div>
                  </div>

                  {/* Name & Details */}
                  <div className="min-w-0 flex-1">
                    <h4 className="text-white font-bold text-base truncate">{item.name}</h4>
                    <p className="text-indigo-400 text-xs font-semibold truncate flex items-center gap-1">
                      <Building className="w-3 h-3" /> {item.role} @ {item.company}
                    </p>
                    <p className="text-slate-400 text-[11px] truncate flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3 h-3" /> {item.college}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
