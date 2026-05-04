// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';

// interface SetPasswordModalProps {
//   email: string;
//   orderId: string;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export default function SetPasswordModal({ email, orderId, onClose, onSuccess }: SetPasswordModalProps) {
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (password !== confirmPassword) {
//       setMessage('Passwords do not match');
//       return;
//     }

//     if (password.length < 6) {
//       setMessage('Password must be at least 6 characters');
//       return;
//     }

//     setLoading(true);
//     setMessage('');

//     try {
//       console.log('Sending request with:', { email, password, orderId });

//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/set-guest-password`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           orderId,
//         }),
//       });

//       const data = await response.json();
//       console.log('Backend response:', data);

//       // ✅ FIX: Check for success flag instead of response.ok
//       if (data.success) {
//         setMessage('Account created successfully! Redirecting to login...');
//         setTimeout(() => {
//           onSuccess();
//           router.push('/login?message=account_created&redirect=/orders');
//         }, 2000);
//       } else {
//         // ✅ FIX: Use message from backend response
//         setMessage(data.message || 'Failed to create account');
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       setMessage('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-md w-full p-6">
//         <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Your Account</h2>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               disabled
//               className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               minLength={6}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D97A22] focus:border-[#D97A22] transition-all duration-200"
//               placeholder="Enter password (min 6 characters)"
//             />
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D97A22] focus:border-[#D97A22] transition-all duration-200"
//               placeholder="Confirm your password"
//             />
//           </div>

//           {message && (
//             <div className={`p-3 rounded-md ${
//               message.includes('successfully') 
//                 ? 'bg-[#D97A22]/10 text-[#D97A22] border border-[#D97A22]/20' 
//                 : 'bg-red-100 text-red-800 border border-red-200'
//             }`}>
//               {message}
//             </div>
//           )}

//           <div className="flex gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={loading}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D97A22] to-[#D97A22] text-white rounded-md hover:opacity-90 transition-all duration-200 font-medium disabled:opacity-50 cursor-pointer"
//             >
//               {loading ? 'Creating Account...' : 'Create Account'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }