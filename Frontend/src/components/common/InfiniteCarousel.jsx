import React, { useRef, useState, useEffect, useCallback } from 'react';

export default function InfiniteCarousel({ children, speed = 1, itemWidth = 300, gap = 32 }) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const firstChild = contentRef.current.children[0];
        
        if (!firstChild) {
          setIsOverflowing(false);
          return;
        }

        const actualItemWidth = firstChild.offsetWidth;
        const childCount = React.Children.count(children);
        
        // Exact content width based on rendered DOM element
        const totalContentWidth = (childCount * actualItemWidth) + ((childCount - 1) * gap);
        
        setIsOverflowing(totalContentWidth > containerWidth);
      }
    };

    // Delay to allow images to load/DOM to settle
    setTimeout(checkOverflow, 100);
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [children, gap]);

  // Auto-scroll logic using scrollLeft
  const animateScroll = useCallback(() => {
    if (!containerRef.current || !contentRef.current || !isOverflowing) return;
    
    // If paused by hover or dragging, just loop the RAF without scrolling
    if (!isPaused && !isDragging) {
      containerRef.current.scrollLeft += speed;
      
      // Calculate max scroll (half of the duplicated content)
      const maxScroll = contentRef.current.scrollWidth / 2;
      
      // If we've scrolled past half, snap back to 0 instantly for seamless loop
      if (containerRef.current.scrollLeft >= maxScroll) {
        containerRef.current.scrollLeft -= maxScroll;
      } else if (containerRef.current.scrollLeft <= 0 && speed < 0) {
        // If scrolling left and hit start, snap to middle
        containerRef.current.scrollLeft += maxScroll;
      }
    }
    
    rafRef.current = requestAnimationFrame(animateScroll);
  }, [isOverflowing, isPaused, isDragging, speed]);

  useEffect(() => {
    if (isOverflowing) {
      rafRef.current = requestAnimationFrame(animateScroll);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOverflowing, animateScroll]);

  // Handle drag scrolling
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!isOverflowing) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchStart = (e) => {
    if (!isOverflowing) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isOverflowing) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
    
    // Manual loop handling during drag
    const maxScroll = contentRef.current.scrollWidth / 2;
    if (containerRef.current.scrollLeft >= maxScroll) {
       containerRef.current.scrollLeft -= maxScroll;
       setScrollLeft(prev => prev - maxScroll); // Update reference to avoid jumping back
    } else if (containerRef.current.scrollLeft <= 0) {
       containerRef.current.scrollLeft += maxScroll;
       setScrollLeft(prev => prev + maxScroll);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !isOverflowing) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
    
    const maxScroll = contentRef.current.scrollWidth / 2;
    if (containerRef.current.scrollLeft >= maxScroll) {
       containerRef.current.scrollLeft -= maxScroll;
       setScrollLeft(prev => prev - maxScroll);
    } else if (containerRef.current.scrollLeft <= 0) {
       containerRef.current.scrollLeft += maxScroll;
       setScrollLeft(prev => prev + maxScroll);
    }
  };

  const handleMouseUpOrLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    // Add a slight delay before resuming animation
    setTimeout(() => {
      if (!containerRef.current?.matches(':hover')) {
        setIsPaused(false);
      }
    }, 2000);
  };

  return (
    <div 
      className="relative w-full px-[10%] overflow-hidden py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsPaused(false);
      }}
    >
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <div 
        ref={containerRef}
        className={`w-full ${isOverflowing ? 'overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing' : 'flex justify-center items-center'}`}
        onMouseDown={isOverflowing ? handleMouseDown : undefined}
        onMouseLeave={isOverflowing ? handleMouseUpOrLeave : undefined}
        onMouseUp={isOverflowing ? handleMouseUpOrLeave : undefined}
        onMouseMove={isOverflowing ? handleMouseMove : undefined}
        onTouchStart={isOverflowing ? handleTouchStart : undefined}
        onTouchEnd={isOverflowing ? handleMouseUpOrLeave : undefined}
        onTouchMove={isOverflowing ? handleTouchMove : undefined}
      >
        <div 
          ref={contentRef}
          className={`flex flex-nowrap ${isOverflowing ? 'w-max' : 'justify-center items-center'}`}
          style={{ gap: `${gap}px` }}
        >
          {/* Render original items */}
          {children}
          
          {/* Duplicate items for infinite loop only if overflowing */}
          {isOverflowing && children}
        </div>
      </div>
    </div>
  );
}
