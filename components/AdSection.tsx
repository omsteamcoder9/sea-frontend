// 'use client';

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { Young_Serif } from 'next/font/google';

// const youngSerif = Young_Serif({
//   weight: '400',
//   subsets: ['latin'],
//   display: 'swap',
// });

// interface AdSectionProps {
//   images?: string[];
//   titles?: string[];
//   descriptions?: string[];
// }

// const AdSection: React.FC<AdSectionProps> = ({ 
//   images,
// titles = [
//   'Curved Harvest Knife with Fresh Asparagus',
//   'Vintage Curved Blade Farming Tool',
//   'Compact Curved Blade Cutter on Decorative Handle',
//   'Traditional Hook-Handled Sickle Blade Tool',
//   'Pair of Curved Hook-Handled Farming Blades',
//   'Curved Blade Tool Opening Fresh Coconut',
//   'Curved Blade Tool Cutting Tree Trunk'
// ],

// descriptions = [
//   'A rustic gardening scene featuring a curved stainless steel harvest knife with a wooden handle placed beside a bundle of fresh asparagus on dark soil, with a burlap cloth and leather blade cover nearby.',
//   'An aged metal hand tool featuring a long curved blade with a hooked handle end, isolated on a plain light background, resembling a traditional agricultural cutting implement.',
//   'A small handheld cutting tool with a curved metal blade mounted on a bright pink rectangular handle featuring white floral patterns, displayed against a black background.',
//   'A metal agricultural hand tool featuring a long curved sickle-style blade with a hooked handle end, isolated on a plain light background.',
//   'Two traditional metal agricultural cutting tools with curved blades and hook-shaped handles, displayed side by side on a plain light background.',
//   'A person uses a blue curved cutting tool to trim and open the top of a fresh green coconut, with water splashing out, captured in an outdoor setting.',
//   'A person uses a blue curved chopping tool to cut through a tree trunk in a forest setting, with wood chips flying from the impact.'
// ]
// }) => {
//   const trackRef = useRef<HTMLDivElement>(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isMobile, setIsMobile] = useState(false);

//   const defaultImages = [
//     '/images/new1.jpg',
//     '/images/new2.jfif',
//         '/images/new7.jfif',
//           '/images/new3.jfif',
//             '/images/new4.jfif',
//     '/images/new5.jfif',
//     '/images/new6.jfif',
  
  


//   ];


//   const imageList = images && images.length === 5 ? images : defaultImages;

//   const centerCard = useCallback((index: number) => {
//     if (!trackRef.current) return;
    
//     const card = trackRef.current.children[index] as HTMLElement;
//     if (!card) return;
    
//     const axis = isMobile ? 'top' : 'left';
//     const size = isMobile ? 'clientHeight' : 'clientWidth';
//     const start = isMobile ? card.offsetTop : card.offsetLeft;
//     const parent = trackRef.current.parentElement;
    
//     if (parent) {
//       parent.scrollTo({
//         [axis]: start - (parent[size] / 2 - card[size] / 2),
//         behavior: 'smooth'
//       });
//     }
//   }, [isMobile]);

//   const activate = useCallback((index: number, shouldScroll: boolean = true) => {
//     if (index === currentIndex) return;
//     setCurrentIndex(index);
//     if (shouldScroll) centerCard(index);
//   }, [currentIndex, centerCard]);

//   const go = useCallback((step: number) => {
//     const totalCards = imageList.length;
//     const newIndex = Math.min(Math.max(currentIndex + step, 0), totalCards - 1);
//     activate(newIndex, true);
//   }, [currentIndex, activate, imageList.length]);

//   useEffect(() => {
//     const checkMobile = () => setIsMobile(window.matchMedia('(max-width:767px)').matches);
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (['ArrowRight', 'ArrowDown'].includes(e.key)) go(1);
//       if (['ArrowLeft', 'ArrowUp'].includes(e.key)) go(-1);
//     };
    
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [go]);

//   useEffect(() => {
//     if (!trackRef.current) return;
    
//     let touchStartX = 0;
//     let touchStartY = 0;
    
//     const handleTouchStart = (e: TouchEvent) => {
//       touchStartX = e.touches[0].clientX;
//       touchStartY = e.touches[0].clientY;
//     };
    
//     const handleTouchEnd = (e: TouchEvent) => {
//       const deltaX = e.changedTouches[0].clientX - touchStartX;
//       const deltaY = e.changedTouches[0].clientY - touchStartY;
//       const threshold = 60;
      
//       if (isMobile ? Math.abs(deltaY) > threshold : Math.abs(deltaX) > threshold) {
//         go((isMobile ? deltaY : deltaX) > 0 ? -1 : 1);
//       }
//     };
    
//     const track = trackRef.current;
//     track.addEventListener('touchstart', handleTouchStart);
//     track.addEventListener('touchend', handleTouchEnd);
    
//     return () => {
//       track.removeEventListener('touchstart', handleTouchStart);
//       track.removeEventListener('touchend', handleTouchEnd);
//     };
//   }, [go, isMobile]);

//   useEffect(() => {
//     centerCard(currentIndex);
//   }, [currentIndex, centerCard, isMobile]);

//   useEffect(() => {
//     centerCard(0);
//   }, [centerCard]);

//   return (
//     <section className="w-full px-5 bg-white font-sans">
//       {/* Header Section */}
//       <div className="w-full  pt-[70px] pb-10">
//         <h2 className={`${youngSerif.className}  text-center text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#4A2C1A] mb-3 xs:mb-4 sm:mb-6 leading-tight`}>
//              <span style={{ color: '#D97A22' }}>Boost your professional</span>{' '}
//           <span style={{ color: '#4A2C1A' }}>workflow and productivity</span>
//         </h2>
//       </div>

//       {/* Slider Section */}
//       <div className="w-full  overflow-hidden ">
//         <div 
//           ref={trackRef}
//           className="flex gap-5 items-start justify-center scroll-smooth pb-10 overflow-x-auto hide-scrollbar md:flex-row flex-col"
//           style={{ scrollSnapType: isMobile ? 'y mandatory' : 'x mandatory' }}
//         >
//           {imageList.map((image, idx) => (
//             <article
//               key={idx}
//               className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
//                 isMobile ? 'w-full min-h-[80px]' : 'flex-[0_0_5rem]'
//               } ${currentIndex === idx ? (isMobile ? 'min-h-[300px]' : 'flex-[0_0_30rem] -translate-y-1.5 shadow-2xl') : ''}`}
//               style={{ 
//                 height: isMobile ? 'auto' : '26rem',
//                 scrollSnapAlign: 'start'
//               }}
//               onMouseEnter={() => {
//                 if (window.matchMedia('(hover:hover)').matches) activate(idx, true);
//               }}
//               onClick={() => activate(idx, true)}
//             >
//               {/* Background Image */}
//               <img
//                 src={image}
//                 alt={titles[idx]}
//                 className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:brightness-90 group-hover:scale-105"
              
//               />
              
//               {/* Content Overlay */}
//               <div className={`absolute inset-0 flex flex-col justify-center items-center gap-2 z-10  ${
//                 currentIndex === idx ? 'md:flex-row md:items-center md:p-5 md:gap-4' : ''
//               }`}>
         
//         {/* Overlay */}
//               <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />

//               {/* Content */}
//               <div className={`absolute inset-0 flex flex-col justify-end p-4 ${
//                 !isMobile && currentIndex === idx ? 'justify-center items-center text-center' : ''
//               }`}>
//                 <h3
//                   className={`${youngSerif.className} text-white font-bold drop-shadow-md ${
//                     currentIndex === idx
//                       ? isMobile ? 'text-2xl mb-2' : 'text-3xl mb-3'
//                       : isMobile ? 'text-xl' : 'text-base [writing-mode:vertical-rl] rotate-180'
//                   }`}
//                 >
//                   {titles[idx]}
//                 </h3>

//                 {currentIndex === idx && (
//                   <p className="text-white/80 text-sm leading-relaxed mt-2 max-w-xs">
//                     {descriptions[idx]}
//                   </p>
//                 )}
//               </div>
//  </div>
//             </article>
//           ))}
//         </div>
//       </div>

//       {/* Dots Navigation */}
//       <div className={`flex gap-2 justify-center py-5 ${isMobile ? 'hidden' : ''}`}>
//         {imageList.map((_, idx) => (
//           <button
//             key={idx}
//             onClick={() => activate(idx, true)}
//             className={`w-3 h-3 rounded-full transition-all duration-300 ${
//               currentIndex === idx 
//                 ? 'bg-[#D97A22] scale-125' 
//                 : 'bg-white/35'
//             }`}
//             aria-label={`Go to slide ${idx + 1}`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default AdSection;