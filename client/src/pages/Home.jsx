import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import WelcomeBanner from '../components/Common/WelcomeBanner';
import Hero from '../components/Hero/Hero';
import Features from '../components/Features/Features';
import FeaturedCompanies from '../components/FeaturedCompanies/FeaturedCompanies';
import Categories from '../components/Categories/Categories';
import Stats from '../components/Stats/Stats';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const elem = document.getElementById(location.state.scrollTo);
      if (elem) {
        setTimeout(() => {
          elem.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <MainLayout>
      {/* Optional Session Banner */}
      <WelcomeBanner />

      {/* Hero Section */}
      <Hero />

      {/* Platform Features Section */}
      <Features />

      {/* Featured Hiring Companies */}
      <FeaturedCompanies />

      {/* Internship Categories */}
      <Categories />

      {/* Platform Statistics */}
      <Stats />

      {/* Candidate & Recruiter Testimonials */}
      <Testimonials />

      {/* Final Call to Action */}
      <CTA />
    </MainLayout>
  );
};

export default Home;
