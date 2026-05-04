// 'use client';
// import { useState } from 'react';
// import { resetPassword } from '@/lib/auth-api';
// import { useRouter } from 'next/navigation';

// interface ResetPasswordFormProps {
//   token: string;
// }

// export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState('');
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (newPassword !== confirmPassword) {
//       setMessage('Passwords do not match');
//       return;
//     }

//     if (newPassword.length < 6) {
//       setMessage('Password must be at least 6 characters long');
//       return;
//     }

//     setIsLoading(true);
//     setMessage('');

//     try {
//       const result = await resetPassword({ token, newPassword });
//       setMessage(result.message);
      
//       // Redirect to login after successful reset
//       setTimeout(() => {
//         router.push('/login');
//       }, 2000);
//     } catch (error) {
//       setMessage(error instanceof Error ? error.message : 'Something went wrong');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="newPassword" className="sr-only">
//             New Password
//           </label>
//           <input
//             id="newPassword"
//             name="newPassword"
//             type="password"
//             autoComplete="new-password"
//             required
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D97A22] focus:border-[#D97A22] focus:z-10 sm:text-sm"
//             placeholder="Enter new password"
//             minLength={6}
//           />
//         </div>

//         <div>
//           <label htmlFor="confirmPassword" className="sr-only">
//             Confirm Password
//           </label>
//           <input
//             id="confirmPassword"
//             name="confirmPassword"
//             type="password"
//             autoComplete="new-password"
//             required
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#D97A22] focus:border-[#D97A22] focus:z-10 sm:text-sm"
//             placeholder="Confirm new password"
//             minLength={6}
//           />
//         </div>
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
//           {isLoading ? 'Resetting...' : 'Reset Password'}
//         </button>
//       </div>
//     </form>
//   );
// }