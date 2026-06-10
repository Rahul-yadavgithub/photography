import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaYoutube, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import JourneyInNumbers from '../JourneyInNumbers';

function Footer() {
  return (
    <footer className="w-full flex flex-col font-sans">
      {/* Section 6 — Trust Bar (Above Footer) */}
      <JourneyInNumbers />
      
      {/* Main Footer Content */}
      <div className="bg-[#0F172A] pt-24 pb-12 px-6 md:px-12 lg:px-16 w-full">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">
          
          {/* 1. Brand Information */}
          <div className="lg:col-span-1 flex flex-col">
            <h3 className="text-2xl font-serif font-light tracking-wide text-white mb-6">GuideStudio</h3>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-8">
              Capturing timeless moments through cinematic wedding films and premium photography experiences.
            </p>
            <div className="flex flex-col gap-2 mb-8 border-l border-[#D4AF37]/30 pl-4">
              <span className="text-white text-sm font-medium">100+ <span className="text-[#94A3B8] font-normal">Weddings Covered</span></span>
              <span className="text-white text-sm font-medium">1000+ <span className="text-[#94A3B8] font-normal">Happy Clients</span></span>
              <span className="text-white text-sm font-medium">5+ Years <span className="text-[#94A3B8] font-normal">Experience</span></span>
            </div>
            <div className="flex items-center gap-5">
              <a href="#" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors"><FaYoutube size={20} /></a>
              <a href="#" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="text-[#94A3B8] hover:text-[#D4AF37] transition-colors"><FaWhatsapp size={20} /></a>
            </div>
          </div>

          {/* 2. Our Services */}
          <div className="flex flex-col">
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-8">Our Services</h4>
            <ul className="flex flex-col gap-4">
              {['Wedding Photography', 'Wedding Films', 'Pre-Wedding Shoots', 'Couple Photography', 'Tourist Photography', 'Corporate Events', 'Store Opening Coverage'].map(item => (
                <li key={item}><Link to="#" className="text-[#94A3B8] text-sm hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* 3. Explore */}
          <div className="flex flex-col">
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-8">Explore</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: 'Packages', path: '/packages' },
                { name: 'Wedding Films', path: '/wedding-films' },
                { name: 'Shoot Inspiration', path: '/shoot' },
                { name: 'Portfolio', path: '/portfolio' },
                { name: 'Testimonials', path: '/testimonials' },
                { name: 'Book Consultation', path: '/contact' }
              ].map(link => (
                <li key={link.name}><Link to={link.path} className="text-[#94A3B8] text-sm hover:text-white transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* 4. Contact Information */}
          <div className="flex flex-col">
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-8">Contact Us</h4>
            <ul className="flex flex-col gap-6 text-[#94A3B8] text-sm">
              <li><span className="block text-white mb-1 font-medium">Phone Number</span>+91 98765 43210</li>
              <li><span className="block text-white mb-1 font-medium">WhatsApp</span>+91 98765 43210</li>
              <li><span className="block text-white mb-1 font-medium">Email Address</span>guide@example.com</li>
              <li><span className="block text-white mb-1 font-medium">Business Hours</span>Mon - Sun<br/>9 AM – 8 PM</li>
            </ul>
          </div>

          {/* 5. Quick CTA */}
          <div className="lg:col-span-1 flex flex-col bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl h-fit">
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-4">Plan Your Shoot</h4>
            <p className="text-[#94A3B8] text-sm mb-8 leading-relaxed">Ready to create something unforgettable?</p>
            <div className="flex flex-col gap-4">
              <Link to="/contact" className="w-full flex items-center justify-center bg-[#D4AF37] text-[#0F172A] py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors rounded-sm">
                Book Your Date
              </Link>
              <Link to="/contact" className="w-full flex items-center justify-center border border-[#94A3B8]/30 text-white py-3.5 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-colors rounded-sm">
                Talk To Us
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="max-w-[1200px] mx-auto border-t border-white/10 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#94A3B8] text-xs">© 2026 GuideStudio. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-[#94A3B8] text-xs">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/cancellation" className="hover:text-white transition-colors">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
