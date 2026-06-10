import React from 'react';
import Hero from '../components/Hero';
import Glimpses from '../components/Glimpses';
import Testimonials from '../components/Testimonials';

function Home() {
  return (
    <>
      <Hero />
      {/* Spacer to allow scrolling past the overlapping card */}
      <div className="h-64"></div>
      <Glimpses />
      <Testimonials />
    </>
  );
}

export default Home;
