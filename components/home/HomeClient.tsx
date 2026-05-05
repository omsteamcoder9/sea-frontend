// components/home/HomeClient.tsx
'use client';

import { Truck, Shield, Minus, Plus, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { Category } from '@/types/category';
import ProductGrid from '@/components/products/ProductGrid';
import Image from "next/image";
import { getAllProducts } from '@/lib/productService';
import Link from 'next/link';

interface HomeClientProps {
  categories: Category[];
  featuredCategories: Category[];
}

const heroSlides = [
  {
    id: 1,
    topBadge: "FRESH FROM THE OCEAN. QUALITY GUARANTEED.",
    mainTitle: "SEA FISH",
    tagline: "FRESH. HEALTHY. DELICIOUS.",
    description: "Premium quality fresh sea fish delivered to your doorstep. Perfect for healthy meals and traditional recipes.",
    features: [
      { title: "FRESH & HYGENIC", sub: "ICE PACKED" },
      { title: "RICH IN OMEGA", sub: "HEALTHY" },
      { title: "IDEAL FOR CURRY,", sub: "FRY & GRILL" },
      { title: "DIRECT FROM", sub: "HARBOUR" }
    ],
    ctaText: "ORDER NOW",
    bgImage: "/images/hero1.png",
  },
  {
    id: 2,
    topBadge: "CATCH OF THE DAY. FRESHEST SEAFOOD.",
    mainTitle: "Crafted for Taste. Delivered Fresh.",
    tagline: "",
    description: "Our fresh sea fish is sourced directly from local fishermen, ensuring the highest quality and freshness for your family.",
    features: [
      { title: "DIRECT SOURCE", sub: "No Middlemen" },
      { title: "FRESH & CLEAN", sub: "Premium Quality" },
      { title: "QUICK DELIVERY", sub: "Same Day Shipping" }
    ],
    ctaText: "ORDER NOW",
    bgImage: "/images/hero.png",
  },
];

export default function HomeClient({ categories, featuredCategories }: HomeClientProps) {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<string[]>([]);
  const [checkingProducts, setCheckingProducts] = useState(true);

  useEffect(() => {
    const checkCategoriesForProducts = async () => {
      try {
        setCheckingProducts(true);
        const categoriesWithProductsList: string[] = [];
        
        for (const category of featuredCategories) {
          const response = await getAllProducts({ category: category._id });
          if (response.data && response.data.length > 0) {
            categoriesWithProductsList.push(category._id);
          }
        }
        
        setCategoriesWithProducts(categoriesWithProductsList);
      } catch (error) {
        console.error('Error checking categories for products:', error);
      } finally {
        setCheckingProducts(false);
      }
    };

    if (featuredCategories.length > 0) {
      checkCategoriesForProducts();
    }
  }, [featuredCategories]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const navigateToProducts = () => {
    router.push('/products');
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const faqItems = [
    {
      question: "How fresh is the sea fish you deliver?",
      answer: "Our sea fish is sourced daily from local fishermen and packed with ice. We ensure same-day delivery for maximum freshness."
    },
    {
      question: "Is the fish cleaned and cut before delivery?",
      answer: "Yes, we provide fresh cleaned and cut fish as per your preference. You can choose whole fish, fillets, or curry cuts."
    },
    {
      question: "How should I store the fresh fish?",
      answer: "Store in refrigerator and consume within 24 hours for best taste. For longer storage, keep in freezer up to 2 weeks."
    },
    {
      question: "Do you deliver to all locations?",
      answer: "We currently deliver to major cities and towns. Check your pincode on our delivery page for service availability."
    },
    {
      question: "Do you offer bulk orders for restaurants?",
      answer: "Yes, we provide bulk ordering options for restaurants, hotels, and seafood businesses. Contact us for wholesale pricing."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const visibleCategories = featuredCategories.filter(
    category => categoriesWithProducts.includes(category._id)
  );

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Slider Section */}
      <section className="relative h-[500px] xs:h-[600px] sm:h-[700px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out ${
                currentSlide === index ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
              }`}
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
              <div className="relative w-full h-full">
                <Image
                  src={slide.bgImage}
                  alt={slide.mainTitle}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  quality={90}
                  className="object-cover object-center"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-0.5 xs:h-1 z-30 flex gap-0.5 xs:gap-1">
          {heroSlides.map((_, index) => (
            <div key={index} className="h-full flex-1 bg-white/20 overflow-hidden">
              <div 
                className={`h-full transition-all duration-[5000ms] ease-linear ${
                  currentSlide === index ? 'w-full' : 'w-0'
                }`}
                style={{ backgroundColor: '#2EC4B6' }}
              />
            </div>
          ))}
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-12 lg:px-16">
          <div key={currentSlide} className="max-w-2xl text-left animate-slide-in">
            <div className="mb-4 xs:mb-5 sm:mb-6">
              <p className="tracking-[0.2em] uppercase text-[11px] xs:text-xs font-semibold text-white/80">
                {heroSlides[currentSlide].topBadge}
              </p>
            </div>

            <h1 className="font-serif leading-[1.1] mb-3 xs:mb-4">
              {heroSlides[currentSlide].mainTitle === "SEA FISH" ? (
                <>
                  <span className="block text-6xl xs:text-5xl sm:text-6xl font-light tracking-tight text-white">
                    Sea
                  </span>
                  <span className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic font-extralight" style={{ color: '#2EC4B6' }}>
                    Fish
                  </span>
                </>
              ) : (
                <span className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-light tracking-tight text-white">
                  {heroSlides[currentSlide].mainTitle}
                </span>
              )}
            </h1>

            {heroSlides[currentSlide].tagline && (
              <p className="text-lg xs:text-xl sm:text-2xl font-medium mb-3 xs:mb-4 text-white/90">
                {heroSlides[currentSlide].tagline}
              </p>
            )}

            <p className="text-sm xs:text-base mb-6 xs:mb-8 max-w-md text-white/80">
              {heroSlides[currentSlide].description}
            </p>

            <div className={`grid gap-3 xs:gap-4 mb-6 xs:mb-8 ${
              heroSlides[currentSlide].features.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
            }`}>
              {heroSlides[currentSlide].features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 xs:gap-3">
                  <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-white/10">
                    <svg className="w-4 h-4 xs:w-5 xs:h-5" style={{ color: '#2EC4B6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-xs xs:text-sm text-white">{feature.title}</p>
                    <p className="text-[10px] xs:text-xs text-white/70">{feature.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={navigateToProducts}
              className="px-6 xs:px-8 py-2 xs:py-3 rounded-full font-bold text-sm xs:text-base hover:opacity-80 transition-all duration-300 shadow-lg"
              style={{ backgroundColor: '#2EC4B6', color: '#014F56' }}
            >
              {heroSlides[currentSlide].ctaText}
            </button>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute right-3 xs:right-4 sm:right-6 md:right-16 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4 xs:gap-5 sm:gap-6">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative flex items-center justify-end"
            >
              <span className={`mr-2 xs:mr-3 sm:mr-4 text-[8px] xs:text-[9px] sm:text-[10px] font-bold transition-all duration-300 ${
                currentSlide === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
              } text-white`}>
                0{index + 1}
              </span>
              <div className={`w-1.5 xs:w-2 h-1.5 xs:h-2 rounded-full transition-all duration-500 ${
                currentSlide === index ? 'scale-150' : 'hover:scale-125'
              }`} style={{ backgroundColor: currentSlide === index ? '#2EC4B6' : 'white' }} />
            </button>
          ))}
        </div>

        {/* Prev/Next Buttons */}
        <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 right-3 xs:right-4 sm:right-6 md:right-20 z-30 flex items-center gap-1">
          <button
            onClick={prevSlide}
            className="p-2 xs:p-3 sm:p-4 backdrop-blur-md hover:bg-white/20 transition-all rounded border border-white/30 bg-white/10"
          >
            <svg className="w-4 h-4 xs:w-5 xs:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="p-2 xs:p-3 sm:p-4 backdrop-blur-md hover:bg-white/20 transition-all rounded border border-white/30 bg-white/10"
          >
            <svg className="w-4 h-4 xs:w-5 xs:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* Explore Products Section */}
      {!checkingProducts && visibleCategories.length > 0 && (
        <section className="py-8">
          <div className="container mx-auto px-1">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-3" style={{ color: '#2EC4B6' }}>
                Explore Our Fresh Seafood Collection
              </h2>
              <p className="max-w-2xl mx-auto text-gray-600">
                Discover premium quality sea fish, fresh from the harbour to your kitchen
              </p>
            </div>

            <div className="space-y-12">
              {visibleCategories.map((category, index) => (
                <div key={category._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 300}ms`, animationFillMode: 'both' }}>
                  <div className="mb-6 px-4">
                    <div className="flex flex-col items-center justify-center text-center mb-4">
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {category.name}
                      </h3>
                    </div>
                    <div className="flex justify-center">
                      <div className="h-1 w-20 rounded-full" style={{ backgroundColor: '#2EC4B6' }}></div>
                    </div>
                  </div>
                  <ProductGrid category={category._id} limit={8} hideFilters={true} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {!checkingProducts && visibleCategories.length === 0 && (
        <section className="py-8">
          <div className="container mx-auto px-1 text-center">
            <p className="text-gray-500">No seafood available at the moment. Please check back later.</p>
          </div>
        </section>
      )}

      {/* Mission Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group order-2 lg:order-1">
              <div className="absolute -inset-4 rounded-3xl rotate-3 transition-transform group-hover:rotate-1 duration-500 bg-gradient-to-r from-[#2EC4B6]/10 via-[#2EC4B6]/5 to-transparent" />
              <div className="relative h-[450px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-[#2EC4B6]/20">
                <Image
                  src="/images/home1.jpg"
                  alt="Fresh Sea Fish Showcase"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  quality={85}
                  className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                />
              </div>
            </div>
            
            <div className="space-y-10 order-1 lg:order-2">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-serif text-gray-800">Our Vision</h2>
                <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: '#2EC4B6' }} />
              </div>
              
              <div className="space-y-6 text-lg leading-relaxed text-gray-600">
                <p>
                  We are committed to providing premium quality fresh sea fish including various varieties 
                  like Mackerel, Sardines, Pomfret, and traditional seafood choices.
                </p>
                <p className="font-light">
                  Our mission is to help families enjoy healthy, fresh seafood with reliable delivery and quality that lasts.
                </p>
              </div>

              <div className="p-8 rounded-2xl border-l-8 italic text-xl font-serif leading-relaxed shadow-sm bg-gray-50" style={{ borderLeftColor: '#2EC4B6', color: '#555' }}>
                Fresh seafood makes every meal better and every recipe more delicious.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Carousel Section */}
      <section className="relative w-full min-h-[450px] flex items-center overflow-hidden bg-gray-50">
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-10">
          <svg width="600" height="400" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 200C40 100 160 100 160 0" stroke="#2EC4B6" strokeWidth="0.5" />
            <path d="M60 200C60 100 180 100 180 0" stroke="#2EC4B6" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="container mx-auto px-6 md:px-12 z-10">
          <div className="grid lg:grid-cols-2 items-center gap-8">
            <div className="max-w-xl py-10">
              <p className="text-sm font-medium mb-2 tracking-wide" style={{ color: '#2EC4B6' }}>
                Weekly Fresh Catch
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 text-gray-800">
                Amazing Freshness: <span style={{ color: '#2EC4B6' }}>Weekly Seafood Must-Haves</span>
              </h1>
              <p className="text-sm md:text-base mb-8 max-w-md italic text-gray-600">
                Get the best deals on fresh Mackerel, Sardines, Pomfret, 
                and other traditional seafood varieties.
              </p>
              <Link href="/shop" className="inline-flex items-center justify-center px-10 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-all duration-300 shadow-xl" style={{ backgroundColor: '#2EC4B6', color: '#014F56' }}>
                Shop Now <span className="ml-2 text-lg">→</span>
              </Link>
            </div>
            <div className="relative flex justify-end items-end h-full">
              <img src="/images/new1.jpg" alt="Fresh Sea Fish" className="w-auto h-[350px] md:h-[450px] lg:h-[500px] object-contain object-bottom" />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 tracking-tight text-gray-800">
              Why Choose Our Fresh Seafood
            </h2>
            <div className="w-20 h-1 mx-auto mb-6 rounded-full" style={{ backgroundColor: '#2EC4B6' }}></div>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Trusted quality seafood sourced directly from local fishermen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Quick and safe delivery with ice packing to your doorstep.', highlight: 'Same Day' },
              { icon: Shield, title: 'Premium Quality', desc: '100% Fresh seafood sourced directly from harbour.', highlight: 'Certified Fresh' },
              { icon: Clock, title: 'Fresh Arrivals', desc: 'Daily fresh catch delivered to maintain peak quality.', highlight: 'Daily Fresh' },
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-3xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(46,196,182,0.08)] flex flex-col items-center text-center bg-white border border-gray-100">
                <div className="w-16 h-16 mb-6 flex items-center justify-center rounded-2xl transition-all duration-500 shadow-sm bg-[#2EC4B6]/10 text-[#2EC4B6]">
                  <feature.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed mb-6 text-[15px]">{feature.desc}</p>
                <div className="mt-auto">
                  <span className="text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#2EC4B6]/10 text-[#2EC4B6] border border-[#2EC4B6]/20">
                    {feature.highlight}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold mb-3 text-gray-800">Frequently Asked Questions</h2>
            <p className="max-w-2xl mx-auto text-gray-600">Find answers to common questions about our fresh seafood</p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((faq, index) => (
              <div key={index} className="mb-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 bg-white">
                <button className="w-full px-6 py-4 text-left flex justify-between items-center transition-colors duration-300 hover:bg-gray-50" onClick={() => toggleFaq(index)}>
                  <span className="font-semibold text-lg text-gray-800">{faq.question}</span>
                  <span style={{ color: '#2EC4B6' }}>
                    {openFaqIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaqIndex === index ? 'py-4 max-h-96' : 'max-h-0 py-0'}`}>
                  <p className="leading-relaxed text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <style jsx global>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in { animation: slide-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
}