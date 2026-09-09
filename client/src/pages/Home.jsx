import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Hero from '../components/Hero/Hero';
import FeaturedCompanies from '../components/FeaturedCompanies/FeaturedCompanies';
import Categories from '../components/Categories/Categories';
import Stats from '../components/Stats/Stats';
import Testimonials from '../components/Testimonials/Testimonials';
import CTA from '../components/CTA/CTA';

const Home = () => {
  return (
    <MainLayout>
      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Featured Companies */}
      <FeaturedCompanies />

      {/* 4. Internship Categories */}
      <Categories />

      {/* 5. Platform Statistics */}
      <Stats />

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. Call to Action */}
      <CTA />
    </MainLayout>
  );
};

export default Home;
