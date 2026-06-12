import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaYoutube, FaFacebook, FaWhatsapp } from 'react-icons/fa';
import JourneyInNumbers from '../JourneyInNumbers';

function Footer() {
  return (
    <footer className="w-full flex flex-col font-sans">
      {/* Section 6 — Trust Bar (Above Footer) */}
      <JourneyInNumbers />
      
      {/* Main Footer Content */}
      <div className="bg-[#0F172A] pt-24 pb-12 px-6 md:px-12 lg:px-16 w-full">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] gap-12 lg:gap-[60px] mb-20">
          
          {/* 1. Brand Information */}
          <div className="flex flex-col">
            <div className="mb-8 inline-block">
              <Link to="/" className="flex items-center gap-4 cursor-pointer group py-1 shrink-0">
                {/* 1. Circular Monogram Logo */}
                <div className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-[3deg]">
                  <img 
                    src="https://res.cloudinary.com/dzbliymin/image/upload/v1781267132/logosls_vcamss.jpg" 
                    alt="Shubham Studio Logo" 
                    className="w-[clamp(48px,12vw,80px)] h-[clamp(48px,12vw,80px)] shrink-0 object-cover rounded-full border-[2px] border-[#C9A24E]"
                  />
                  {/* Premium subtle glow on hover */}
                  <div className="absolute inset-0 rounded-full bg-[#C9A24E] opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                </div>

                {/* 2. Gold Vertical Line */}
                <div className="flex items-center h-12">
                  <div className="w-[1px] h-full bg-[#C9A24E] group-hover:shadow-[0_0_8px_rgba(201,162,78,0.6)] transition-shadow duration-300"></div>
                </div>

                {/* Text Area */}
                <div className="flex items-center gap-[clamp(4px,1vw,8px)] shrink-0 whitespace-nowrap">
                  {/* 3. SHUBHAM Text */}
                  <span className="font-serif text-[clamp(16px,4.5vw,24px)] tracking-[2px] text-white group-hover:brightness-110 transition-all duration-300">
                    SHUBHAM
                  </span>
                  
                  {/* 4. STUDIO Text */}
                  <span className="font-serif text-[clamp(16px,4.5vw,24px)] tracking-[2px] text-[#C9A24E] group-hover:brightness-110 transition-all duration-300">
                    STUDIO
                  </span>
                </div>
              </Link>
            </div>
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
              {['Wedding Photography', 'Wedding Films', 'Pre-Wedding Shoots', 'Couple Photography', 'Corporate Events'].map(item => (
                <li key={item}><Link to="#" className="text-[#94A3B8] text-sm hover:text-white transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          {/* 3. Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-8">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {[
                { name: 'Packages', path: '/packages' },
                { name: 'Films', path: '/films' },
                { name: 'Shoot Inspiration', path: '/shoot' },
                { name: 'Portfolio', path: '/portfolio' },
                { name: 'Store', path: '/store' },
                { name: 'Testimonials', path: '/testimonials' }
              ].map(link => (
                <li key={link.name}><Link to={link.path} className="text-[#94A3B8] text-sm hover:text-white transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          {/* 4. Contact Information */}
          <div className="flex flex-col">
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase mb-8">Contact Us</h4>
            <ul className="flex flex-col gap-6 text-[#94A3B8] text-sm">
              <li><span className="block text-white mb-1 font-medium">Phone Number</span>+91 6389629652</li>
              <li><span className="block text-white mb-1 font-medium">WhatsApp</span>+91 6389629652</li>
              <li><span className="block text-white mb-1 font-medium">Email Address</span>photostudioshubham403@gmail.com</li>
              <li><span className="block text-white mb-1 font-medium">Business Hours</span>24/7</li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="max-w-[1200px] mx-auto border-t border-white/10 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[#94A3B8] text-xs">© 2026 Shubham Studio. All Rights Reserved.</p>
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
