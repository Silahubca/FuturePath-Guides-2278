import React from 'react';
import { motion } from 'framer-motion';
import Hero from './sections/Hero';
import Introduction from './sections/Introduction';
import ProductSeries from './sections/ProductSeries';
import Testimonials from './sections/Testimonials';
import CallToAction from './sections/CallToAction';
import Footer from './sections/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Introduction />
      <ProductSeries />
      <Testimonials />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;