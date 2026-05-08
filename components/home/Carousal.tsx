'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from 'react';
import { Category } from '@/types/category';

interface CategoryCarouselProps {
  displayCategories?: Category[];
}

const API_IMG_URL = process.env.NEXT_PUBLIC_IMG_URL;

export default function CategoryCarousel({ displayCategories = [] }: CategoryCarouselProps) {
  const router = useRouter();
  const [position, setPosition] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const speed = 0.06;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        if (displayCategories.length > 0) {
          setCategories(displayCategories);
        } else {
          const { fetchActiveCategories } = await import('@/lib/categoryService');
          const data = await fetchActiveCategories();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [displayCategories]);

  const getDuplicatedArray = () => {
    if (!categories.length) return [];
    const duplicateCount = categories.length <= 3 ? 8 : 4;
    return Array(duplicateCount).fill(categories).flat();
  };
  
  const carouselCategories = getDuplicatedArray();
  
  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time;
    }
    
    const delta = time - lastTimeRef.current;
    lastTimeRef.current = time;
    
    setPosition(prev => {
      if (!containerRef.current) return prev;
      
      const containerWidth = containerRef.current.scrollWidth;
      const singleSetWidth = containerWidth / (carouselCategories.length / categories.length);
      
      const newPosition = prev + speed * delta;
      
      if (newPosition >= singleSetWidth) {
        return 0;
      }
      
      return newPosition;
    });
    
    animationRef.current = requestAnimationFrame(animate);
  }, [categories.length, carouselCategories.length]);

  useEffect(() => {
    if (!loading && categories.length > 0 && mounted) {
      setPosition(0);
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, loading, categories.length, mounted]);

  const getCategoryImage = (category: Category) => {
    if (category.image) {
      let imagePath = category.image;
      if (imagePath.startsWith('/uploads/')) {
        imagePath = imagePath.replace('/uploads/', '');
      }
      return `${API_IMG_URL}/${imagePath}`;
    }
    return null;
  };

  const getCategoryColor = (name: string) => {
    const colors = ['#014F56', '#2EC4B6', '#0A7B72', '#1A9C93'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  if (!mounted || loading) {
    return (
      <section className="w-full py-2 bg-white overflow-hidden">
        <div className="container mx-auto px-2">
          <div className="flex justify-center items-center h-16">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#014F56]"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) return null;

  const handleCategoryClick = (category: Category) => {
    router.push(`/products?category=${category.slug || category._id}`);
  };

  return (
    <section className="w-full py-1 bg-white overflow-hidden">
      <div className="container mx-auto px-1 max-w-full">
        <div className="relative overflow-hidden">
          {/* Minimal gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
          
          {/* Carousel Track */}
          <div 
            ref={containerRef}
            className="flex gap-5 py-1"
            style={{ transform: `translateX(-${position}px)` }}
          >
            {carouselCategories.map((category, index) => {
              const categoryImage = getCategoryImage(category);
              const fallbackColor = getCategoryColor(category.name);
              
              return (
                <div 
                  key={`${category._id}-${index}`}
                  className="flex-shrink-0 w-14 sm:w-16 md:w-20 group cursor-pointer"
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="bg-white rounded-md p-1 hover:bg-gray-50 transition-all duration-150">
                    {/* Tiny Circular Icon */}
                    <div 
                      className="relative aspect-square rounded-full overflow-hidden mb-0.5 flex items-center justify-center"
                      style={{ 
                        backgroundColor: categoryImage ? undefined : `${fallbackColor}10`,
                      }}
                    >
                      {categoryImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={categoryImage}
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              const span = document.createElement('span');
                              span.className = 'text-xs font-bold';
                              span.style.color = fallbackColor;
                              span.textContent = category.name.charAt(0).toUpperCase();
                              parent.appendChild(span);
                            }
                          }}
                        />
                      ) : (
                        <span 
                          className="text-xs font-bold"
                          style={{ color: fallbackColor }}
                        >
                          {category.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Tiny Category Name */}
                    <h3 className="text-center text-gray-600 text-[10px] truncate leading-tight">
                      {category.name.length > 8 ? category.name.slice(0, 6) + '..' : category.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}