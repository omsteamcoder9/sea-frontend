'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getAllProducts } from '@/lib/productService';
import { Product } from '@/types/product';

// Interface for hero slide data
interface HeroSlide {
  id: number;
  image: string;
  altText: string;
  productName: string;
  price: string;
  originalPrice: string;
  productSlug: string;
}

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [entranceAnimationDone, setEntranceAnimationDone] = useState(false);

  // --- Data & Logic Helpers ---
  const getProductImage = (product: Product) => {
    const imgBaseUrl = process.env.NEXT_PUBLIC_IMG_URL;
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
      if (defaultVariant?.images?.[0]?.image) {
        const imagePath = defaultVariant.images[0].image;
        if (imagePath.startsWith('http')) return imagePath;
        let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        if (cleanPath.startsWith('uploads/')) cleanPath = cleanPath.replace('uploads/', '');
        return `${imgBaseUrl}/${cleanPath}`;
      }
    }
    if (product.images && product.images.length > 0 && product.images[0]?.image) {
      const imagePath = product.images[0].image;
      if (imagePath.startsWith('http')) return imagePath;
      let cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      if (cleanPath.startsWith('uploads/')) cleanPath = cleanPath.replace('uploads/', '');
      return `${imgBaseUrl}/${cleanPath}`;
    }
    return '/images/placeholder-fish.jpg';
  };

  const getProductOfferInfo = (product: Product) => {
    if (product.variants && product.variants.length > 0) {
      const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
      if (defaultVariant?.originalPrice && defaultVariant?.price && 
          parseFloat(defaultVariant.originalPrice.toString()) > parseFloat(defaultVariant.price.toString())) {
        return { hasOffer: true, originalPrice: parseFloat(defaultVariant.originalPrice.toString()), discountedPrice: parseFloat(defaultVariant.price.toString()) };
      }
      return { hasOffer: false, originalPrice: parseFloat(defaultVariant?.price?.toString() || '0'), discountedPrice: parseFloat(defaultVariant?.price?.toString() || '0') };
    }
    return { hasOffer: false, originalPrice: parseFloat(product.basePrice?.toString() || '0'), discountedPrice: parseFloat(product.basePrice?.toString() || '0') };
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        const response = await getAllProducts({});
        if (response.success && response.data.length > 0) {
          const slides: HeroSlide[] = response.data.map((product: Product, index: number) => {
            const offerInfo = getProductOfferInfo(product);
            return {
              id: index + 1,
              image: getProductImage(product),
              altText: product.name,
              productName: product.name.length > 20 ? product.name.substring(0, 17) + '...' : product.name,
              price: `₹${Math.round(offerInfo.discountedPrice)}`,
              originalPrice: offerInfo.hasOffer ? `₹${Math.round(offerInfo.originalPrice)}` : '',
              productSlug: product.slug,
            };
          });
          setHeroSlides(slides);
        }
      } catch (error) {
        console.error('Error fetching hero products:', error);
      } finally {
        setLoading(false);
        setTimeout(() => setEntranceAnimationDone(true), 100);
      }
    };
    fetchHeroProducts();
  }, []);

  const nextSlide = useCallback(() => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  // Changed interval to 3 seconds (3000ms)
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(nextSlide, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, [nextSlide, heroSlides.length]);

  if (loading || heroSlides.length === 0) {
    return (
      <section className="h-[300px] flex items-center justify-center bg-[#5E0006]">
        <div className="w-8 h-8 border-3 border-[#D53E0F]/20 border-t-[#D53E0F] rounded-full animate-spin"></div>
      </section>
    );
  }

  const currentProduct = heroSlides[currentSlide];

  // Helper for triggering animation on every slide change
  const getAnimationClass = (delay: string) => {
    return `animate-slideInRight ${delay}`;
  };

  return (
    <section className="relative w-full bg-[#5E0006] py-4 md:py-6 overflow-hidden min-h-[300px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center relative gap-4">
          
          {/* IMAGE SECTION (Left) - Keyed to currentSlide to restart animation */}
          <div 
            key={`image-${currentSlide}`}
            className={`relative z-20 w-full md:w-[40%] flex justify-center items-center transition-all duration-1000 ${entranceAnimationDone ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
          >
            <div className="relative w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] group transition-all duration-700 ease-in-out hover:scale-105">
              <div className="absolute inset-2 rounded-full bg-[#D53E0F]/10 group-hover:bg-[#D53E0F]/20 group-hover:blur-2xl transition-all duration-700 z-0" />
              <div className="absolute inset-0 rounded-full shadow-[0_15px_30px_rgba(213,62,15,0.15)] overflow-hidden border-[4px] md:border-[6px] border-[#EED9B9]/20 z-10">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-800 ease-in-out ${
                      index === currentSlide 
                        ? 'opacity-100 scale-100 rotate-0'
                        : 'opacity-0 scale-110 -rotate-3'
                    }`}
                  >
                    {!imageErrors[index] ? (
                      <Image
                        src={slide.image}
                        alt={slide.altText}
                        fill
className="object-contain bg-gradient-to-t from-[#5E0006] via-[#9B0F06] to-[#5E0006]"
                        onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))}
                        priority={index === 0}
                        sizes="(max-width: 768px) 140px, 220px"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#9B0F06] flex items-center justify-center text-[#D53E0F]/50 text-xs">Error</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-2 -left-2 bg-[#5E0006]/90 backdrop-blur-sm p-1.5 rounded-xl shadow-xl border border-[#D53E0F]/30 z-30 hidden sm:block animate-bounce-slow">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded-full border-2 border-[#D53E0F]/20 border-t-[#D53E0F] animate-spin-slow" />
                  <div>
                    <div className="text-[6px] text-[#D53E0F]/70 font-black uppercase tracking-tighter">Fresh</div>
                    <div className="text-xs font-black text-[#D53E0F]">100%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION (Right Pill Container) */}
          <div className="relative w-full md:w-[60%] md:-ml-16 overflow-hidden">
            
            {/* Pill Background Shape */}
            <div className={`absolute inset-0 bg-[#9B0F06]/80 backdrop-blur-sm rounded-[40px] md:rounded-l-none md:rounded-r-[180px] border border-[#D53E0F]/30 z-0 transition-transform duration-1000 ease-out origin-center ${entranceAnimationDone ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`} />
            
            {/* Text Content - Keyed to currentSlide to restart animation on change */}
            <div key={`content-${currentSlide}`} className="relative z-10 py-6 px-6 md:pl-24 md:pr-12 text-center md:text-left">
              
              <h2 className={`text-white text-lg sm:text-xl md:text-2xl font-extralight tracking-tighter mb-0 ${getAnimationClass('delay-100')}`}>
                Fresh & Delicious
              </h2>
              
              <h1 className={`text-[#EED9B9] text-2xl sm:text-3xl md:text-4xl font-serif italic tracking-wide -mt-1 md:-mt-2 mb-2 ${getAnimationClass('delay-200')}`}>
                SEAFOOD
              </h1>
              
              <p className={`text-[#EED9B9]/70 text-xs sm:text-sm md:text-base max-w-md mb-4 leading-relaxed mx-auto md:mx-0 ${getAnimationClass('delay-300')}`}>
                Enjoy premium ocean-fresh seafood with{' '}
                <span className="font-bold text-[#D53E0F]">healthy delicious</span>{' '}
                {currentProduct.productName.toLowerCase()} from{' '}
                <span className="font-semibold text-[#EED9B9]">{currentProduct.price}</span>.
              </p>

              <div className={getAnimationClass('delay-400')}>
                <button 
                  onClick={() => router.push(`/products/${currentProduct.productSlug}`)}
                  className="group inline-flex items-center bg-[#5E0006] rounded-full shadow-lg hover:shadow-[#D53E0F]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 pl-5 pr-1.5 py-1.5 border border-[#D53E0F]/30"
                >
                  <span className="text-[#EED9B9] font-bold text-[10px] uppercase tracking-[0.2em] mr-2 transition-colors group-hover:text-white">
                    View More
                  </span>
                  <div className="bg-[#D53E0F] text-[#5E0006] p-1.5 rounded-lg group-hover:bg-white transition-colors duration-300">
                    <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Progress Indicators - Outside keyed div so they don't re-animate */}
            <div className="relative z-20 pb-6 px-6 md:pl-24 flex gap-2 justify-center md:justify-start">
              {heroSlides.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1 transition-all duration-500 rounded-full ${i === currentSlide ? 'w-6 bg-[#D53E0F] shadow-[0_2px_8px_rgba(213,62,15,0.3)]' : 'w-1.5 bg-[#D53E0F]/20 hover:bg-[#D53E0F]/40'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        
        /* Right-to-Left Slide Animation */
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(40px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }

        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        
        .animate-slideInRight { 
          animation: slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
      `}</style>
    </section>
  );
}