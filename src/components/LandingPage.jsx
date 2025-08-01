import React from 'react';
import Hero from './sections/Hero';
import Introduction from './sections/Introduction';
import ProductSeries from './sections/ProductSeries';
import Testimonials from './sections/Testimonials';
import CallToAction from './sections/CallToAction';
import Footer from './sections/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#ffffff]">
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