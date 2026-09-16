"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Chennai",
      rating: 5,
      text: "Sea Food has been my go-to for fresh MeenavanFresh. The quality is exceptional and delivery is always on time. Their prawns and fish are incredibly fresh!",
      project: "Fresh Fish Delivery",
      satisfaction: "100%",
      satisfactionLabel: "FRESHNESS RATING",
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Excellent quality MeenavanFresh delivered right to my doorstep. The packaging is perfect and the fish stays fresh. Highly recommend their premium MeenavanFresh selection.",
      project: "Premium MeenavanFresh Order",
      satisfaction: "98%",
      satisfactionLabel: "QUALITY ASSURANCE",
    },
    {
      name: "Murugan Selvam",
      location: "Coimbatore",
      rating: 4,
      text: "Great experience with Sea Food. Their tiger prawns and crabs are amazing. The delivery was prompt and customer service is excellent.",
      project: "Special Occasion Order",
      satisfaction: "99%",
      satisfactionLabel: "DELIVERY SERVICE",
    },
    {
      name: "Lakshmi Devi",
      location: "Bangalore",
      rating: 5,
      text: "Finally found a reliable MeenavanFresh supplier! The freshness is unmatched and the prices are reasonable. Their frozen section is also great.",
      project: "Regular MeenavanFresh Delivery",
      satisfaction: "100%",
      satisfactionLabel: "CUSTOMER SATISFACTION",
    },
    {
      name: "Karthik Raman",
      location: "Hyderabad",
      rating: 5,
      text: "Professional service with excellent MeenavanFresh quality. Their selection of fish varieties is impressive. Will definitely order again!",
      project: "Family MeenavanFresh Order",
      satisfaction: "97%",
      satisfactionLabel: "PRODUCT VARIETY",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? "text-[#00A9E0] fill-[#00A9E0]" : "text-[#B8DCE7]"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className=" py-8 sm:py-16 relative"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #008FB8 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-8 sm:mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-[#008FB8]/10 border border-[#008FB8]/30 mb-4"
          >
            <span className="text-[#063B5C] text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Customer Testimonials
            </span>
          </motion.div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#063B5C] mb-4 sm:mb-6 px-2">
            What Our{" "}
            <span className="bg-gradient-to-r from-[#008FB8] to-[#00A9E0] bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-sm sm:text-lg text-[#315A6E] max-w-3xl mx-auto leading-relaxed px-4"
          >
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience
            getting fresh, premium quality MeenavanFresh delivered by Sea Food.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 items-center">
          {/* Left Side - Testimonial Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-white to-[#EAF8FC] rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-12 border border-[#B8DCE7] shadow-2xl">
              {/* Quote Icon */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-[#008FB8] mb-4 sm:mb-6"
              >
                <Quote className="w-8 h-8 sm:w-12 sm:h-12 opacity-40" />
              </motion.div>

              {/* Testimonial Text with Animation */}
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-[#063B5C] text-sm sm:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-8 font-light"
                >
                  "{testimonials[currentIndex].text}"
                </motion.blockquote>
              </AnimatePresence>

              {/* Customer Info */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="border-t border-[#B8DCE7] pt-4 sm:pt-8"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div>
                    <div className="text-[#063B5C] font-semibold text-sm sm:text-xl">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-[#008FB8] text-xs sm:text-sm">{testimonials[currentIndex].location}</div>
                  </div>
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
                <div className="text-[#315A6E] text-xs sm:text-sm">
                  Purchase: <span className="text-[#063B5C] font-medium">{testimonials[currentIndex].project}</span>
                </div>
              </motion.div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4 sm:mt-8">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <motion.button
                    onClick={prevTestimonial}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 sm:w-12 sm:h-12 bg-[#008FB8]/20 hover:bg-[#008FB8]/40 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-[#063B5C]" />
                  </motion.button>
                  <motion.button
                    onClick={nextTestimonial}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 sm:w-12 sm:h-12 bg-[#008FB8]/20 hover:bg-[#008FB8]/40 rounded-full flex items-center justify-center transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-[#063B5C]" />
                  </motion.button>
                </div>

                {/* Dots Indicator */}
                <div className="flex space-x-1 sm:space-x-2">
                  {testimonials.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      whileHover={{ scale: 1.2 }}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? "bg-[#008FB8] w-4 sm:w-8" 
                          : "bg-[#008FB8]/30 hover:bg-[#008FB8]/50 w-1.5 sm:w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Image */}
          <motion.div 
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
            className="relative"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/h1.jpg"
                alt="Happy customers with fresh MeenavanFresh from Sea Food"
                width={600}
                height={500}
                className="w-full h-64 sm:h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063B5C]/30 to-transparent"></div>
            </motion.div>
          </motion.div>
        </div>

        {/* Additional Testimonials Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-16"
        >
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 400 } }}
              className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 border border-[#B8DCE7] hover:border-[#008FB8] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                {renderStars(testimonial.rating)}
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#008FB8]/30" />
              </div>
              <p className="text-[#315A6E] text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-3">"{testimonial.text}"</p>
              <div>
                <div className="text-[#063B5C] font-semibold text-xs sm:text-sm">{testimonial.name}</div>
                <div className="text-[#008FB8] text-xs">{testimonial.project}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}