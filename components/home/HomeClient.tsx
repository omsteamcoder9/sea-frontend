// components/home/HomeClient.tsx
'use client';

import { Truck, Shield, Minus, Plus, Calendar, AlarmClock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Category } from '@/types/category';
import ProductGrid from '@/components/products/ProductGrid';
import { getAllProducts } from '@/lib/productService';
import TestimonialsSection from '@/components/Testimonial';
import HomeHeroBanner from '@/components/HomeHeroBanner';
import CategoryCarousel from '@/components/home/Carousal';
import HeroSection from '@/components/herosection';

interface HomeClientProps {
  categories: Category[];
  featuredCategories: Category[];
}

export default function HomeClient({ categories, featuredCategories }: HomeClientProps) {
  const router = useRouter();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  const [categoriesWithProducts, setCategoriesWithProducts] = useState<string[]>([]);
  const [checkingProducts, setCheckingProducts] = useState(true);

  // Get tomorrow's date for display
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  useEffect(() => {
    const checkCategoriesForProducts = async () => {
      try {
        setCheckingProducts(true);
        const categoriesWithProductsList: string[] = [];
        
        for (const category of categories) {
          const response = await getAllProducts({ category: category.slug });
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

    if (categories.length > 0) {
      checkCategoriesForProducts();
    }
  }, [categories]);

  const faqItems = [
    {
      question: "How fresh is the sea fish you deliver?",
      answer: "Our sea fish is sourced daily from local fishermen and packed with ice. We ensure next-day delivery for maximum freshness. Order today, get fresh catch delivered tomorrow!"
    },
    {
      question: "When will I receive my order?",
      answer: `We follow a next-day delivery policy. Orders placed today will be delivered tomorrow (${getTomorrowDate()}). This ensures you receive the freshest catch possible.`
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
      answer: "Yes, we provide bulk ordering options for restaurants, hotels, and MeenavanFresh businesses. Contact us for wholesale pricing."
    },
    {
      question: "What is your delivery policy?",
      answer: "We operate on a next-day delivery model. All orders placed today are prepared fresh and delivered tomorrow. Cutoff time for same-day processing is 8:00 PM. Orders placed after cutoff will be delivered the day after tomorrow."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const visibleCategories = categories.filter(
    category => categoriesWithProducts.includes(category._id)
  );

  return (
    <div className="min-h-screen overflow-hidden">
      {categories && categories.length > 0 && (
        <CategoryCarousel displayCategories={categories} />
      )}

      {/* Delivery Info Banner - Order Today, Get Tomorrow */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-[#064B6A] via-[#065A7A] to-[#008FB8] text-white py-2 sm:py-3 px-2 sm:px-4 relative overflow-hidden"
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-0 sm:gap-6 text-center">

            {/* Order Today */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-0 min-w-0">
              <Calendar className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0 animate-pulse" />
              <span className="font-semibold text-[9px] leading-[13px] sm:text-sm sm:leading-normal md:text-base">
                Order Today • Get Tomorrow ({getTomorrowDate()})
              </span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>

            {/* Mobile Divider */}
            <div className="sm:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-8 bg-white/30"></div>

            {/* Cutoff */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 px-1.5 sm:px-0 min-w-0">
              <AlarmClock className="w-3.5 h-3.5 sm:w-5 sm:h-5 shrink-0" />
              <span className="text-[9px] leading-[13px] sm:text-sm sm:leading-normal md:text-base">
                Cutoff: 8:00 PM for next-day delivery
              </span>
            </div>

          </div>
        </div>

        {/* Shimmer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite] transform -skew-x-12"></div>
        </div>
      </motion.div>

      {/* Hero Section Component */}
      <HeroSection />

      {/* Explore Products Section */}
      {!checkingProducts && visibleCategories.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-6 sm:py-8"
        >
          <div className="container mx-auto px-1 sm:px-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6 sm:mb-8 px-2"
            >
   <h2 className="text-lg xs:text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 animate-gradient-text">
  Explore Our MeenavanFresh Collection
</h2>
              <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="max-w-2xl mx-auto text-sm sm:text-base text-[#315A6E]"
              >
                Discover premium quality sea fish, fresh from the harbour to your kitchen
              </motion.p>
            </motion.div>

            <div className="space-y-8 sm:space-y-12">
              {visibleCategories.map((category, index) => (
                <motion.div 
                  key={category._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <div className="mb-4 sm:mb-6 px-2 sm:px-4">
                    <div className="flex flex-col items-center justify-center text-center mb-3 sm:mb-4">
                      <motion.h3 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                        className="text-xl sm:text-2xl md:text-3xl font-bold text-[#063B5C]"
                      >
                        {category.name}
                      </motion.h3>
                    </div>
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: 80 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                      className="flex justify-center"
                    >
                      <div className="h-1 rounded-full" style={{ backgroundColor: '#008FB8', width: '80px' }}></div>
                    </motion.div>
                  </div>
                  <ProductGrid category={category.slug} limit={8} hideFilters={true} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {!checkingProducts && visibleCategories.length === 0 && (
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-6 sm:py-8"
        >
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm sm:text-base text-[#315A6E]/60">No MeenavanFresh available at the moment. Please check back later.</p>
          </div>
        </motion.section>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8"
      >
        <HomeHeroBanner />
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-10 sm:py-20"
      >
        <div className="container mx-auto px-3 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 sm:mb-12"
          >
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 tracking-tight animate-gradient-text">
              Why Choose Our MeenavanFresh
            </h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-16 sm:w-20 h-1 mx-auto mb-3 sm:mb-6 rounded-full"
              style={{ backgroundColor: '#008FB8' }}
            ></motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto text-xs sm:text-base md:text-lg text-[#315A6E] px-2 sm:px-0"
            >
              Trusted quality MeenavanFresh sourced directly from local fishermen
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
            {[
              { icon: Calendar, title: 'Next-Day Delivery', desc: 'Order today, get fresh MeenavanFresh delivered tomorrow. Guaranteed same-day dispatch.', highlight: 'Tomorrow Delivery' },
              { icon: Truck, title: 'Fast & Safe Delivery', desc: 'Quick and safe delivery with ice packing to your doorstep.', highlight: 'Ice Packed' },
              { icon: Shield, title: 'Premium Quality', desc: '100% Fresh MeenavanFresh sourced directly from harbour daily.', highlight: 'Certified Fresh' },
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100, damping: 15 }}
                whileHover={{ y: -5 }}
                className="group p-4 sm:p-7 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,143,184,0.12)] flex flex-col items-center text-center bg-white border border-[#B8DCE7]"
              >
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                  className="w-11 h-11 sm:w-16 sm:h-16 mb-3 sm:mb-6 flex items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-500 shadow-sm bg-[#008FB8]/10 text-[#008FB8] group-hover:bg-[#008FB8] group-hover:text-white"
                >
                  <feature.icon size={20} className="sm:w-[28px] sm:h-[28px]" strokeWidth={1.5} />
                </motion.div>
                <h3 className="text-base sm:text-xl font-bold mb-1.5 sm:mb-3 text-[#063B5C]">{feature.title}</h3>
                <p className="text-[#315A6E]/80 leading-relaxed mb-3 sm:mb-6 text-xs sm:text-[15px] px-1">{feature.desc}</p>
                <div className="mt-auto">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    className="text-[9px] sm:text-[11px] font-bold uppercase tracking-widest px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#008FB8]/10 text-[#008FB8] border border-[#008FB8]/20 group-hover:bg-[#008FB8] group-hover:text-white transition-all duration-300"
                  >
                    {feature.highlight}
                  </motion.span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <TestimonialsSection />
      </motion.div>

      {/* FAQ Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="py-10 sm:py-12 border-t border-[#B8DCE7]"
      >
        <div className="container mx-auto px-3 sm:px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 sm:mb-10"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 animate-gradient-text">
              Frequently Asked Questions
            </h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto text-xs sm:text-base text-[#315A6E]"
            >
              Find answers to common questions about our fresh MeenavanFresh
            </motion.p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqItems.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="mb-3 sm:mb-4 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-[#B8DCE7] bg-white"
              >
                <button 
                  className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left flex justify-between items-center gap-2 transition-colors duration-300 hover:bg-[#F8FCFD]" 
                  onClick={() => toggleFaq(index)}
                >
                  <span className="font-semibold text-sm sm:text-lg text-[#063B5C] leading-snug">{faq.question}</span>
                  <motion.span 
                    animate={{ rotate: openFaqIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                    style={{ color: '#008FB8' }}
                  >
                    {openFaqIndex === index ? <Minus className="w-4 h-4 sm:w-5 sm:h-5" /> : <Plus className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </motion.span>
                </button>
                <motion.div 
                  initial={false}
                  animate={{ 
                    height: openFaqIndex === index ? "auto" : 0,
                    opacity: openFaqIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <p className="text-xs sm:text-base leading-relaxed text-[#315A6E]">{faq.answer}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <style jsx global>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-slide-in { animation: slide-in 0.6s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-marquee {
          animation: marquee 20s linear infinite;
          display: inline-block;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .animate-gradient-text {
          animation: gradient-shift 3s ease infinite;
          background-image: linear-gradient(135deg, #063B5C 0%, #008FB8 50%, #00A9E0 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @media (max-width: 640px) {
          .animate-marquee {
            animation-duration: 15s;
          }
        }
      `}</style>
    </div>
  );
}