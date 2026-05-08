"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import Image from "next/image"

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Chennai",
      rating: 5,
      text: "Sea Food has been my go-to for fresh seafood. The quality is exceptional and delivery is always on time. Their prawns and fish are incredibly fresh!",
      project: "Fresh Fish Delivery",
      satisfaction: "100%",
      satisfactionLabel: "FRESHNESS RATING",
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      text: "Excellent quality seafood delivered right to my doorstep. The packaging is perfect and the fish stays fresh. Highly recommend their premium seafood selection.",
      project: "Premium Seafood Order",
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
      text: "Finally found a reliable seafood supplier! The freshness is unmatched and the prices are reasonable. Their frozen section is also great.",
      project: "Regular Seafood Delivery",
      satisfaction: "100%",
      satisfactionLabel: "CUSTOMER SATISFACTION",
    },
    {
      name: "Karthik Raman",
      location: "Hyderabad",
      rating: 5,
      text: "Professional service with excellent seafood quality. Their selection of fish varieties is impressive. Will definitely order again!",
      project: "Family Seafood Order",
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
            className={`w-3 h-3 sm:w-4 sm:h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  return (
    <section className="bg-gradient-to-br from-[#5E0006]/5 to-[#D53E0F]/5 py-8 sm:py-16 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #D53E0F 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-[#D53E0F]/10 border border-[#D53E0F]/30 mb-4">
            <span className="text-[#5E0006] text-xs sm:text-sm font-semibold uppercase tracking-wider">
              Customer Testimonials
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#5E0006] mb-4 sm:mb-6 px-2">
            What Our{" "}
            <span className="bg-gradient-to-r from-[#D53E0F] to-[#5E0006] bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-sm sm:text-lg text-[#5E0006]/80 max-w-3xl mx-auto leading-relaxed px-4">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience
            getting fresh, premium quality seafood delivered by Sea Food.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-8 items-center">
          {/* Left Side - Testimonial Content */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white to-[#D53E0F]/5 rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-12 border border-[#D53E0F]/20 shadow-2xl">
              {/* Quote Icon */}
              <div className="text-[#D53E0F] mb-4 sm:mb-6">
                <Quote className="w-8 h-8 sm:w-12 sm:h-12 opacity-40" />
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-[#5E0006] text-sm sm:text-lg lg:text-xl leading-relaxed mb-4 sm:mb-8 font-light">
                "{testimonials[currentIndex].text}"
              </blockquote>

              {/* Customer Info */}
              <div className="border-t border-[#D53E0F]/20 pt-4 sm:pt-8">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <div>
                    <div className="text-[#5E0006] font-semibold text-sm sm:text-xl">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-[#D53E0F] text-xs sm:text-sm">{testimonials[currentIndex].location}</div>
                  </div>
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
                <div className="text-[#5E0006]/70 text-xs sm:text-sm">
                  Purchase: <span className="text-[#5E0006] font-medium">{testimonials[currentIndex].project}</span>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-4 sm:mt-8">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <button
                    onClick={prevTestimonial}
                    className="w-8 h-8 sm:w-12 sm:h-12 bg-[#D53E0F]/20 hover:bg-[#D53E0F]/40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-[#5E0006]" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="w-8 h-8 sm:w-12 sm:h-12 bg-[#D53E0F]/20 hover:bg-[#D53E0F]/40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-[#5E0006]" />
                  </button>
                </div>

                {/* Dots Indicator */}
                <div className="flex space-x-1 sm:space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex 
                          ? "bg-[#D53E0F] w-4 sm:w-8" 
                          : "bg-[#D53E0F]/30 hover:bg-[#D53E0F]/50 w-1.5 sm:w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative">
            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/h1.jpg"
                alt="Happy customers with fresh seafood from Sea Food"
                width={600}
                height={500}
                className="w-full h-64 sm:h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#5E0006]/30 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 mt-8 sm:mt-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white/90 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-[#D53E0F]/20 hover:border-[#D53E0F]/60 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                {renderStars(testimonial.rating)}
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#D53E0F]/30" />
              </div>
              <p className="text-[#5E0006]/80 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-3">"{testimonial.text}"</p>
              <div>
                <div className="text-[#5E0006] font-semibold text-xs sm:text-sm">{testimonial.name}</div>
                <div className="text-[#D53E0F] text-xs">{testimonial.project}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}