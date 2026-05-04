// 'use client';

// import { useState, useEffect } from 'react';
// import { ContactFormData } from '@/types/contact';
// import { contactApi } from '../lib/contact';

// export default function ContactForm() {
//   const [formData, setFormData] = useState<ContactFormData>({
//     name: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
//   const [isMounted, setIsMounted] = useState(false);

//   // Fix hydration by ensuring this only runs on client
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setMessage(null);

//     try {
//       if (!formData.subject.trim() || !formData.message.trim()) {
//         throw new Error('Subject and message are required');
//       }

//       await contactApi.submitContact(formData);
//       setMessage({
//         type: 'success',
//         text: 'Thank you for your message! We will get back to you soon.'
//       });
//       setFormData({
//         name: '',
//         email: '',
//         phone: '',
//         subject: '',
//         message: ''
//       });
//     } catch (error) {
//       console.error('Contact form error:', error);
//       setMessage({
//         type: 'error',
//         text: error instanceof Error ? error.message : 'Failed to send message. Please try again.'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Don't render form until mounted on client
//   if (!isMounted) {
//     return (
//       <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
//         <div className="animate-pulse">
//           <div className="h-8 bg-gray-200 rounded mb-6"></div>
//           <div className="space-y-4">
//             <div className="h-4 bg-gray-200 rounded"></div>
//             <div className="h-4 bg-gray-200 rounded"></div>
//             <div className="h-24 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-[#f2f2f2] rounded-lg shadow-lg border border-gray-300">
//       <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Get In Touch</h2>
      
//       {message && (
//         <div
//           className={`p-4 mb-6 rounded-lg cursor-pointer ${
//             message.type === 'success'
//               ? 'bg-gradient-to-r from-[#D97A22]/10 via-[#D97A22]/10 to-[#D97A22]/10 text-[#D97A22] border border-[#D97A22]/20'
//               : 'bg-red-50 text-red-800 border border-red-200'
//           }`}
//           onClick={() => setMessage(null)}
//         >
//           {message.text}
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
//               Full Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97A22] focus:border-[#D97A22] transition-all duration-200 cursor-text"
//               placeholder="Enter your full name"
//             />
//           </div>

//           <div>
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97A22] focus:border-[#D97A22] transition-all duration-200 cursor-text"
//               placeholder="Enter your email address"
//             />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
//             Phone Number
//           </label>
//           <input
//             type="tel"
//             id="phone"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//             className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97A22] focus:border-[#D97A22] transition-all duration-200 cursor-text"
//             placeholder="Enter your phone number (optional)"
//           />
//         </div>

//         <div>
//           <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
//             Subject *
//           </label>
//           <input
//             type="text"
//             id="subject"
//             name="subject"
//             value={formData.subject}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97A22] focus:border-[#D97A22] transition-all duration-200 cursor-text"
//             placeholder="What is this regarding?"
//           />
//         </div>

//         <div>
//           <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
//             Message *
//           </label>
//           <textarea
//             id="message"
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             required
//             rows={6}
//             className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97A22] focus:border-[#D97A22] transition-all duration-200 resize-vertical cursor-text"
//             placeholder="Tell us how we can help you..."
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="w-full bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] text-white py-3 px-6 rounded-lg font-semibold hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e] focus:ring-2 focus:ring-[#D97A22] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
//         >
//           {isSubmitting ? (
//             <div className="flex items-center justify-center">
//               <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
//               Sending...
//             </div>
//           ) : (
//             'Send Message'
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }