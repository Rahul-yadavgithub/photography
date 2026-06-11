import React from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from './Breadcrumbs';

export default function EditorialHero({
  breadcrumbs = [],
  label,
  title,
  description,
  action,
  className = ''
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div className={`relative w-full bg-[#0a0a0a] flex flex-col justify-start overflow-hidden ${className}`}>

      {/* 1. Navbar Spacer (Prevents overlap by matching header height) */}
      <div className="h-20 w-full shrink-0" />

      {/* 2. Background Layer - Minimal subtle gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/40 to-transparent opacity-20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/10 via-transparent to-transparent"></div>
      </div>

      {/* 3. Vertically Centered Content Container */}
      <div className="relative z-10 w-full flex-grow flex items-center min-h-[200px] md:min-h-[280px] py-10 px-4 sm:px-6 lg:px-12 max-w-[1400px] mx-auto">
        <motion.div
          className="max-w-2xl w-full flex flex-col items-start"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Breadcrumbs */}
          <motion.div variants={itemVariants} className="w-full mb-6">
            <Breadcrumbs items={breadcrumbs} theme="dark" className="pb-0 pt-0" />
          </motion.div>

          {/* Label */}
          {label && (
            <motion.div variants={itemVariants} className="mb-4">
              <span className="inline-block px-3 py-1 bg-white/5 backdrop-blur-md text-[#ea580c] text-[10px] font-bold uppercase tracking-[0.2em] border border-white/5 rounded shadow-sm">
                {label}
              </span>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-5 tracking-tight leading-[1.1]"
          >
            {title}
          </motion.h1>

          {/* Description */}
          {description && (
            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base text-zinc-400 leading-relaxed font-light mb-6 max-w-xl"
            >
              {description}
            </motion.p>
          )}

          {/* Action (CTA) */}
          {action && (
            <motion.div variants={itemVariants} className="mt-2">
              {action}
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
