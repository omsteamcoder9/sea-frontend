// 'use client';
// import { useState } from 'react';
// import { forgotPassword } from '@/lib/auth-api';

// export function ForgotPasswordForm() {
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage('');

//     try {
//       const result = await forgotPassword({ email });
//       setMessage(result.message);
//       setEmail('');
//     } catch (error) {
//       setMessage(error instanceof Error ? error.message : 'Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="email" className="sr-only">
//           Email address
//         </label>
//         <input
//           id="email"
//           name="email"
//           type="email"
//           autoComplete="email"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D97A22] focus:border-[#D97A22] focus:z-10 sm:text-sm"
//           placeholder="Enter your email address"
//         />
//       </div>

//       {message && (
//         <div className={`p-3 rounded-md ${message.includes('success') ? 'bg-gradient-to-r from-[#D97A22]/10 via-[#D97A22]/10 to-[#D97A22]/10 text-[#D97A22]' : 'bg-red-50 text-red-800'}`}>
//           {message}
//         </div>
//       )}

//       <div>
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-[#D97A22] via-[#D97A22] to-[#D97A22] hover:from-[#c56a1e] hover:via-[#c56a1e] hover:to-[#c56a1e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D97A22] disabled:opacity-50 cursor-pointer transition-all duration-200"
//         >
//           {isLoading ? 'Sending...' : 'Send Reset Link'}
//         </button>
//       </div>
//     </form>
//   );
// }