// 'use client';

// import React from "react";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState, useCallback } from 'react';
// import { Category } from '@/types/category';

// interface CategoryCarouselProps {
//   displayCategories?: Category[];
// }

// export default function CategoryCarousel({ displayCategories = [] }: CategoryCarouselProps) {
//   const router = useRouter();
//   const [position, setPosition] = useState(0);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [mounted, setMounted] = useState(false);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const animationRef = useRef<number>(0);
//   const lastTimeRef = useRef<number>(0);
//   const speed = 0.11;

//   // Prevent hydration mismatch
//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Fetch categories on component mount if not provided as props
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         if (displayCategories.length > 0) {
//           setCategories(displayCategories);
//         } else {
//           const { fetchActiveCategories } = await import('@/lib/categoryService');
//           const data = await fetchActiveCategories();
//           console.log('Fetched categories:', data);
//           setCategories(data);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, [displayCategories]);

//   // Create a seamless infinite loop by duplicating the array multiple times
//   const getDuplicatedArray = () => {
//     if (!categories.length) return [];
    
//     const duplicateCount = categories.length <= 3 ? 6 : 3;
    
//     return Array(duplicateCount).fill(categories).flat();
//   };
  
//   const carouselCategories = getDuplicatedArray();
  
//   const animate = useCallback((time: number) => {
//     if (!lastTimeRef.current) {
//       lastTimeRef.current = time;
//     }
    
//     const delta = time - lastTimeRef.current;
//     lastTimeRef.current = time;
    
//     setPosition(prev => {
//       if (!containerRef.current) return prev;
      
//       const containerWidth = containerRef.current.scrollWidth;
//       const singleSetWidth = containerWidth / (carouselCategories.length / categories.length);
      
//       const newPosition = prev + speed * delta;
      
//       if (newPosition >= singleSetWidth) {
//         return 0;
//       }
      
//       return newPosition;
//     });
    
//     animationRef.current = requestAnimationFrame(animate);
//   }, [categories.length, carouselCategories.length]);

//   useEffect(() => {
//     if (!loading && categories.length > 0 && mounted) {
//       setPosition(0);
//       animationRef.current = requestAnimationFrame(animate);
//     }
    
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [animate, loading, categories.length, mounted]);

//   // Generate a consistent color based on category name
//   const getCategoryColor = (name: string) => {
//     const colors = [
//       '#D97A22', '#E8913E', '#F0A85A', '#E87A2E', '#D96B1A',
//       '#F4A261', '#E76F51', '#F09D4C', '#E88C3A', '#D9792E'
//     ];
//     let hash = 0;
//     for (let i = 0; i < name.length; i++) {
//       hash = name.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     const index = Math.abs(hash) % colors.length;
//     return colors[index];
//   };

//   if (!mounted || loading) {
//     return (
//       <section className="w-full py-12 md:py-16 lg:py-4 bg-white overflow-hidden">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
//           <div className="text-center mb-10">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
//               <span className="text-gray-900">Shop by Category</span>
//             </h2>
//           </div>
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D97A22]"></div>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   if (!categories.length) return null;

//   const handleCategoryClick = (category: Category) => {
//     router.push(`/products?category=${category.slug || category._id}`);
//   };

//   return (
//     <section className="w-full py-12 md:py-16 lg:py-4 bg-white overflow-hidden">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-full">
//         {/* Section Header */}
//         <div className="text-center mb-10 md:mb-14 lg:mb-16">
//           <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
//             <span className="text-gray-900">Shop by Category</span>
//           </h2>
//           <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-light">
//             Explore our curated collection across various categories
//           </p>
//         </div>

//         {/* Continuous Carousel Container */}
//         <div className="relative overflow-hidden">
//           {/* Gradient Overlays */}
//           <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
//           <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />
          
//           {/* Carousel Track */}
//           <div 
//             ref={containerRef}
//             className="flex gap-6 md:gap-8 lg:gap-10 py-4 md:py-6"
//             style={{ transform: `translateX(-${position}px)` }}
//           >
//             {carouselCategories.map((category, index) => {
//               const color = getCategoryColor(category.name);
              
//               return (
//                 <div 
//                   key={`${category._id}-${index}`}
//                   className="flex-shrink-0 w-48 sm:w-56 md:w-64 group cursor-pointer"
//                   onClick={() => handleCategoryClick(category)}
//                 >
//                   <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 border border-gray-100">
//                     {/* Category Icon/Initial */}
//                     <div 
//                       className="relative aspect-square rounded-full overflow-hidden mb-4 flex items-center justify-center border-2 transition-all duration-300 group-hover:border-[#D97A22]/40"
//                       style={{ 
//                         backgroundColor: `${color}15`,
//                         borderColor: `${color}30`
//                       }}
//                     >
//                       <span 
//                         className="text-4xl md:text-5xl lg:text-6xl font-bold transition-colors duration-300"
//                         style={{ color: color }}
//                       >
//                         {category.name.charAt(0).toUpperCase()}
//                       </span>
//                     </div>

//                     {/* Category Name */}
//                     <h3 className="text-center font-medium text-gray-800 text-sm sm:text-base md:text-lg group-hover:text-[#D97A22] transition-colors duration-300 line-clamp-1 px-1">
//                       {category.name}
//                     </h3>

//                     {/* Optional: Show product count placeholder */}
//                     <p className="text-center text-xs text-gray-400 mt-1 group-hover:text-[#D97A22]/70 transition-colors duration-300">
//                       Explore Collection
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }