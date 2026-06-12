import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function HeaderLogo({ isScrolled, forceDarkText }) {
  // If navbar is transparent/dark, text should be white. If scrolled/light, text should be charcoal.
  const isDarkNavbar = !isScrolled && !forceDarkText;
  
  // Color configuration based on specs
  const goldColor = '#C9A24E';
  const whiteColor = '#FFFFFF';
  const charcoalColor = '#1F2937'; // gray-800
  
  const textColor = isDarkNavbar ? whiteColor : charcoalColor;

  // 1. Logo Fade In (0-300ms) -> slight scale-up (95% to 100%)
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  // 2. Gold Line Draw (300-600ms) -> vertical line expands
  const lineVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: { 
      height: '32px', // Approx 2rem
      opacity: 1,
      transition: { delay: 0.3, duration: 0.3, ease: 'easeInOut' }
    }
  };

  // 3. SHUBHAM Slide In (600-850ms) -> opacity 0 to 100%, slide from left
  const shubhamVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { delay: 0.6, duration: 0.25, ease: 'easeOut' }
    }
  };

  // 4. STUDIO Fade In (850-1200ms) -> fades in 150ms after SHUBHAM
  const studioVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.85, duration: 0.35, ease: 'easeIn' }
    }
  };

  return (
    <Link to="/" className="flex items-center gap-[clamp(6px,1.5vw,16px)] cursor-pointer group py-1 shrink-0">
      {/* 1. Circular Monogram Logo */}
      <motion.div 
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        className="relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-[3deg]"
      >
        <img 
          src="https://res.cloudinary.com/dzbliymin/image/upload/v1781267132/logosls_vcamss.jpg" 
          alt="Shubham Studio Logo" 
          className="w-[clamp(24px,6vw,56px)] h-[clamp(24px,6vw,56px)] shrink-0 object-cover rounded-full border border-[#C9A24E]/30"
        />
      </motion.div>

      {/* 2. Gold Vertical Line */}
      <div className="flex items-center h-[clamp(20px,5vw,32px)]">
        <motion.div 
          variants={lineVariants}
          initial="hidden"
          animate="visible"
          className="w-[1px] group-hover:shadow-[0_0_8px_rgba(201,162,78,0.6)] transition-shadow duration-300"
          style={{ backgroundColor: goldColor }}
        ></motion.div>
      </div>

      {/* Text Area (Visible on all screens with fluid sizing) */}
      <div className="flex items-center gap-[clamp(3px,1vw,6px)] shrink-0 whitespace-nowrap">
        {/* 3. SHUBHAM Text */}
        <motion.span
          variants={shubhamVariants}
          initial="hidden"
          animate="visible"
          className="font-serif text-[clamp(14px,2.5vw,22px)] tracking-[1px] md:tracking-[1.5px] group-hover:brightness-110 transition-all duration-300"
          style={{ color: textColor }}
        >
          SHUBHAM
        </motion.span>
        
        {/* 4. STUDIO Text */}
        <motion.span
          variants={studioVariants}
          initial="hidden"
          animate="visible"
          className="font-serif text-[clamp(14px,2.5vw,22px)] tracking-[1px] md:tracking-[1.5px] group-hover:brightness-110 transition-all duration-300"
          style={{ color: goldColor }}
        >
          STUDIO
        </motion.span>
      </div>
    </Link>
  );
}

export default HeaderLogo;
