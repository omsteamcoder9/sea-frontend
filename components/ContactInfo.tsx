// 'use client';
// import { useEffect, useState } from 'react';
// import { settingsAPI } from '@/lib/settings-api';

// export default function ContactInfo() {
//   const [contactInfo, setContactInfo] = useState({
//     contactNumber: '+91 7200074221',
//     whatsappNumber: '+91 7200074221',
//     callNumber: '+91 7200074221',
//     contactEmail: 'support@soap.com',
//     companyAddress: '123 soap Street'
//   });
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchContactInfo = async () => {
//       try {
//         setLoading(true);
//         const data = await settingsAPI.getContactInfo();
//         setContactInfo(data);
//         setError(null);
//       } catch (err) {
//         console.error('Failed to fetch contact info:', err);
//         setError('Failed to load contact information. Using default values.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContactInfo();
//   }, []);

//   const contactMethods = [
//     {
//       icon: (
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//         </svg>
//       ),
//       title: 'Email',
//       details: contactInfo.contactEmail,
//       description: 'Send us an email anytime'
//     },
//     {
//       icon: (
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//         </svg>
//       ),
//       title: 'Phone',
//       details: contactInfo.contactNumber,
//       description: 'Mon-Fri from 9am to 6pm'
//     },
//     {
//       icon: (
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//         </svg>
//       ),
//       title: 'Address',
//       details: contactInfo.companyAddress,
//       description: '' // Empty string kept as original
//     }
//   ];

//   return (
//     <div className="bg-[#f2f2f2] rounded-lg p-8 border border-gray-300">
//       <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
      
//       <div className="space-y-6">
//         {contactMethods.map((method, index) => (
//           <div 
//             key={index} 
//             className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#D97A22] transition-colors duration-200"
//           >
//             <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-[#D97A22]/10 via-[#D97A22]/10 to-[#D97A22]/10 rounded-lg flex items-center justify-center text-[#D97A22]">
//               {method.icon}
//             </div>
//             <div>
//               <h4 className="font-semibold text-gray-900">{method.title}</h4>
//               <p className="text-gray-800 font-medium">{method.details}</p>
//               <p className="text-gray-600 text-sm">{method.description}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 pt-8 border-t border-gray-300">
//         <h4 className="font-semibold text-gray-900 mb-4">Business Hours</h4>
//         <div className="space-y-3 text-gray-700">
//           <div className="flex justify-between items-center p-2 hover:bg-[#D97A22]/5 rounded-lg transition-colors">
//             <span>Monday - Friday</span>
//             <span className="font-medium text-[#D97A22]">9:00 AM - 6:00 PM</span>
//           </div>
//           <div className="flex justify-between items-center p-2 hover:bg-[#D97A22]/5 rounded-lg transition-colors">
//             <span>Saturday</span>
//             <span className="font-medium text-[#D97A22]">10:00 AM - 4:00 PM</span>
//           </div>
//           <div className="flex justify-between items-center p-2 hover:bg-[#D97A22]/5 rounded-lg transition-colors">
//             <span>Sunday</span>
//             <span className="font-medium text-red-500">Closed</span>
//           </div>
//         </div>
//       </div>

//       {/* <div className="mt-8 pt-8 border-t border-gray-300">
//         <h4 className="font-semibold text-gray-900 mb-4">Visit Our Store</h4>
//         <p className="text-gray-700 mb-2">
//           Come browse our physical collection at our flagship store in soapville.
//         </p>
//         <p className="text-sm text-gray-600">
//           Free parking available • Wheelchair accessible • soap reading events every Saturday
//         </p>
//       </div> */}
//     </div>
//   );
// }