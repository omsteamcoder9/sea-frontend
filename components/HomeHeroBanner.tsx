"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function HomeHeroBanner() {
  // 🎯 Static images base URL (R2)
  const STATIC_URL = process.env.NEXT_PUBLIC_STATIC_URL;

  // Static banner data
  const banner = {
    title: "Meenavan Fresh",
    subtitle: "Fresh Catch Daily",
    description: "Explore the Freshest MeenavanFresh Delivered to Your Doorstep",
    leftImage: `${STATIC_URL}/d1.webp`,
    rightImage: `${STATIC_URL}/d2.webp`,
    leftLink: "/products",
    rightLink: "/products",
    stats: ["Fresh Catch", "Quick Delivery", "Quality Assured"],
  };

  const leftImageUrl = banner.leftImage;
  const rightImageUrl = banner.rightImage;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="flex flex-col w-full overflow-hidden rounded-2xl shadow-lg bg-gradient-to-r from-[#064B6A] to-[#008FB8]"
    >
      
      {/* LEFT IMAGE - Top on mobile, left on desktop */}
      {leftImageUrl && (
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="block md:hidden relative w-full h-[180px] cursor-pointer group overflow-hidden"
        >
          <Link href={banner.leftLink}>
            <Image
              src={leftImageUrl}
              alt={banner.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20" />
          </Link>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* LEFT IMAGE - Desktop version */}
        {leftImageUrl && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="hidden md:block relative w-full md:w-1/3 h-[320px] cursor-pointer group overflow-hidden"
          >
            <Link href={banner.leftLink}>
              <Image
                src={leftImageUrl}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
            </Link>
          </motion.div>
        )}

        {/* CENTER CONTENT */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 150 }}
          className={`
            w-full
            ${leftImageUrl ? 'md:w-1/3' : 'md:w-1/2'}
            ${rightImageUrl ? 'md:w-1/3' : 'md:w-1/2'}
            text-[#EAF8FC]
            flex flex-col justify-center items-center
            px-6 md:px-8
            py-8 md:py-0
            text-center
            relative
            min-h-[280px] md:min-h-[320px]
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-[#EAF8FC]/10 to-transparent pointer-events-none" />

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-wide relative z-10 mb-2 text-white"
          >
            {banner.title}
          </motion.h1>

          {banner.subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-sm md:text-base mt-1 opacity-90 relative z-10 font-medium text-[#EAF8FC]"
            >
              {banner.subtitle}
            </motion.p>
          )}

          {banner.description && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-sm md:text-base lg:text-lg mt-3 md:mt-4 max-w-xs md:max-w-sm relative z-10 text-[#EAF8FC]"
            >
              {banner.description}
            </motion.p>
          )}

          {/* Static stats */}
          {banner.stats && banner.stats.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap justify-center gap-2 mt-6 md:mt-8 relative z-10"
            >
              {banner.stats.map((stat, i) => (
                <motion.span 
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 + (i * 0.1), duration: 0.3 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1.5 md:px-4 md:py-2 bg-[#00A9E0]/20 rounded-full backdrop-blur-sm text-xs md:text-sm font-medium text-[#EAF8FC] hover:bg-[#00A9E0]/30 transition-all cursor-default"
                >
                  {stat}
                </motion.span>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* RIGHT IMAGE - Desktop version */}
        {rightImageUrl && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring", stiffness: 100 }}
            className="hidden md:block relative w-full md:w-1/3 h-[320px] cursor-pointer group overflow-hidden"
          >
            <Link href={banner.rightLink}>
              <Image
                src={rightImageUrl}
                alt={banner.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
            </Link>
          </motion.div>
        )}
      </div>

      {/* RIGHT IMAGE - Bottom on mobile */}
      {rightImageUrl && (
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="block md:hidden relative w-full h-[180px] cursor-pointer group overflow-hidden"
        >
          <Link href={banner.rightLink}>
            <Image
              src={rightImageUrl}
              alt={banner.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </Link>
        </motion.div>
      )}
      
      {/* Show fallback if no images */}
      {!leftImageUrl && !rightImageUrl && (
        <div className="hidden md:block md:w-2/3 bg-gradient-to-r from-[#064B6A] to-[#008FB8]" />
      )}
    </motion.div>
  );
}