import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const AutoScrollingPackageCarousel = ({ packages }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragTimeoutRef = useRef(null);
  const trackRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // Motion value for translating pixels
  const x = useMotionValue(0);

  // Recalculate width on mount and window resize
  useEffect(() => {
    const measureWidth = () => {
      if (trackRef.current && trackRef.current.parentElement) {
        const containerWidth = trackRef.current.parentElement.offsetWidth;
        
        // Find the actual rendered width of the first item
        const firstChild = trackRef.current.children[0];
        
        if (!firstChild) {
          setIsOverflowing(false);
          return;
        }

        const actualItemWidth = firstChild.offsetWidth;
        const gap = 32; // Assuming gap-8 or md:gap-8 (approx 32px)
        const childCount = packages.length;
        
        // Exact content width based on rendered DOM element
        const exactContentWidth = (childCount * actualItemWidth) + ((childCount - 1) * gap);
        
        setIsOverflowing(exactContentWidth > containerWidth);
        setContentWidth(exactContentWidth + gap); // Include the final gap for looping offset
      }
    };

    measureWidth();
    
    // Give images a moment to render and re-measure just in case
    setTimeout(measureWidth, 500);

    window.addEventListener('resize', measureWidth);
    return () => window.removeEventListener('resize', measureWidth);
  }, [packages]);

  const speed = -1; // pixels per frame (negative moves left)
  
  useAnimationFrame((time, delta) => {
    // Pause if user is hovering, dragging, width hasn't been measured, or if NOT overflowing
    if (isHovered || isDragging || contentWidth === 0 || !isOverflowing) return;

    let moveBy = speed * (delta / 16);
    let currentX = x.get();
    currentX += moveBy;

    // Boundary wrapping for infinite loop
    if (currentX <= -contentWidth) {
      currentX += contentWidth; // Seamless snap back to the first set
    } else if (currentX > 0) {
      currentX -= contentWidth; // Seamless snap if pushed right
    }
    
    x.set(currentX);
  });

  // Handle User Panning/Dragging (Touch & Mouse)
  const handlePanStart = () => {
    if (!isOverflowing) return;
    setIsDragging(true);
    setHasDragged(false);
    if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
  };

  const handlePan = (event, info) => {
    if (!isOverflowing) return;
    setHasDragged(true);
    let currentX = x.get() + info.delta.x;
    
    // Boundary wrapping while user is manually dragging
    if (currentX <= -contentWidth) {
      currentX += contentWidth;
    } else if (currentX > 0) {
      currentX -= contentWidth;
    }
    
    x.set(currentX);
  };

  const handlePanEnd = () => {
    // Wait 2 seconds before automatically resuming the scroll animation
    dragTimeoutRef.current = setTimeout(() => {
      setIsDragging(false);
    }, 2000);
  };

  // Prevent link clicks if the user was just trying to swipe/drag the carousel
  const handleClick = (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div 
      className="overflow-hidden w-full relative touch-pan-y"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        // Reset hover state but respect the 2-second timeout if we were dragging
        if (!isDragging) {
           setIsHovered(false);
        }
      }}
      onTouchStart={() => {
        setIsHovered(true);
        if (dragTimeoutRef.current) clearTimeout(dragTimeoutRef.current);
      }}
      onTouchEnd={() => {
        dragTimeoutRef.current = setTimeout(() => {
          setIsHovered(false);
        }, 2000);
      }}
    >
      <motion.div 
        ref={trackRef}
        className={`flex ${isOverflowing ? 'w-max cursor-grab active:cursor-grabbing px-4 md:px-8 py-8' : 'justify-center w-full px-4 md:px-8 py-8'} gap-5 md:gap-8`}
        style={isOverflowing ? { x } : {}}
        onPanSessionStart={isOverflowing ? handlePanStart : undefined}
        onPan={isOverflowing ? handlePan : undefined}
        onPanSessionEnd={isOverflowing ? handlePanEnd : undefined}
      >
        {(isOverflowing ? [...packages, ...packages] : packages).map((pkg, idx) => {
          const key = `${pkg.id || pkg._id}-${idx}`;
          
          return (
            <div 
              key={key} 
              id={pkg.slug || pkg._id}
              className="package-card-item shrink-0 w-[85vw] sm:w-[320px] md:w-[360px] lg:w-[380px] transition-all duration-500"
              onClickCapture={handleClick}
            >
              <div className="premium-package-card overflow-hidden flex flex-col group h-full bg-white rounded-[20px] md:rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:shadow-lg">
                {/* Package Image - Aspect 4/3 on mobile */}
                <div className="relative aspect-[4/3] md:aspect-auto md:h-60 overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                  <img 
                    src={pkg.media?.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'} 
                    alt={pkg.name} 
                    className="w-full h-full object-cover transform md:group-hover:scale-105 transition-transform duration-700 pointer-events-none" 
                    loading="lazy"
                  />
                  
                  {pkg.offer && (
                    <div className="absolute top-4 left-4 md:right-4 md:left-auto pointer-events-none">
                      <span className="px-3 py-1 bg-[#ea580c] text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-md border border-orange-500/30">
                        {pkg.offer.badgeText || "SPECIAL OFFER"}
                      </span>
                    </div>
                  )}
                  {pkg.isPopular && !pkg.offer && (
                    <div className="absolute top-4 left-4 md:right-4 md:left-auto pointer-events-none">
                      <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm">
                        Most Popular
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Content Area */}
                <div className="p-4 md:p-6 flex-grow flex flex-col bg-white">
                  <div className="mb-4 flex-grow">
                    <h3 className="text-[20px] md:text-xl font-semibold md:font-serif text-gray-900 mb-2 leading-snug line-clamp-2 md:group-hover:text-[#ea580c] transition-colors">{pkg.name}</h3>
                    <p className="text-gray-500 text-[11px] font-bold uppercase tracking-wide leading-relaxed line-clamp-2">
                      {pkg.shortDesc || pkg.description}
                    </p>
                    
                    {/* Mini Offer List */}
                    {pkg.offers && pkg.offers.length > 0 && (
                      <div className="mt-4 space-y-1.5">
                        <span className="block text-[10px] uppercase tracking-widest font-bold text-[#ea580c] mb-2">Available Offers</span>
                        {pkg.offers.slice(0, 3).map(offer => (
                          <div key={offer._id} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-xs text-gray-600 font-medium leading-tight">{offer.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <div className="border-t border-gray-200 mb-4"></div>
                    
                    {/* Bottom Action Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mt-2 md:mt-0">
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Price</span>
                        {pkg.showPricing === false ? (
                          <span className="text-[28px] md:text-xl font-bold text-gray-900 leading-none">Custom Quote</span>
                        ) : (
                          (() => {
                            let lowestPrice = pkg.price;
                            if (pkg.offers && pkg.offers.length > 0) {
                              lowestPrice = pkg.offers.reduce((lowest, o) => {
                                if (o.type === 'Percentage Discount') {
                                  const price = pkg.price - (pkg.price * (o.discountPercentage / 100));
                                  return price < lowest ? price : lowest;
                                }
                                if (o.type === 'Flat Discount') {
                                  const price = pkg.price - o.flatDiscountAmount;
                                  return price < lowest ? price : lowest;
                                }
                                return lowest;
                              }, pkg.price);
                            }
                            
                            const hasDiscount = lowestPrice < pkg.price;
                            const savings = pkg.price - lowestPrice;

                            return (
                              <div className="flex flex-col">
                                {hasDiscount && (
                                  <div className="flex items-center gap-2 mb-1 md:mb-0.5">
                                    <span className="text-sm md:text-xs text-gray-400 line-through">₹{pkg.price}</span>
                                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">Save ₹{savings}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2 md:gap-1">
                                  {hasDiscount ? (
                                    <span className="text-[28px] md:text-xl font-bold text-gray-900 leading-none">₹{lowestPrice}</span>
                                  ) : pkg.discountPrice ? (
                                    <>
                                      <span className="text-[28px] md:text-xl font-bold text-gray-900 leading-none">₹{pkg.discountPrice}</span>
                                      <span className="text-sm md:text-xs text-gray-400 line-through">₹{pkg.price}</span>
                                    </>
                                  ) : (
                                    <span className="text-[28px] md:text-xl font-bold text-gray-900 leading-none">₹{pkg.price}</span>
                                  )}
                                </div>
                              </div>
                            );
                          })()
                        )}
                      </div>
                      
                      <Link 
                        to={`/packages/${pkg.slug || pkg.id}`}
                        className="w-full md:w-auto h-[48px] md:h-auto px-5 py-2 flex items-center justify-center gap-2 bg-[#ea580c] text-white text-xs font-bold uppercase tracking-wider rounded-[14px] md:rounded-full hover:bg-[#c2410c] transition-colors shadow-md min-h-[44px]"
                      >
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AutoScrollingPackageCarousel;
