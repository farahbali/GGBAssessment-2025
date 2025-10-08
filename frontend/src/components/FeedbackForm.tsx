// 'use client';

// import { useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/lib/hooks';
// import { createFeedback, clearError } from '@/lib/features/feedback/feedbackSlice';

// export default function FeedbackForm() {
//   const dispatch = useAppDispatch();
//   const { submitting, error } = useAppSelector((state) => state.feedback);
  
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//   });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.title.trim() || !formData.description.trim()) {
//       return;
//     }

//     try {
//       await dispatch(createFeedback({
//         title: formData.title.trim(),
//         description: formData.description.trim(),
//       })).unwrap();
      
//       // Reset form on success
//       setFormData({ title: '', description: '' });
//     } catch (error) {
//       // Error is handled by Redux
//       console.error('Failed to create feedback:', error);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear error when user starts typing
//     if (error) {
//       dispatch(clearError());
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex">
//             <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//         </div>
//       )}

//       <div>
//         <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//           Title *
//         </label>
//         <input
//           type="text"
//           id="title"
//           name="title"
//           value={formData.title}
//           onChange={handleInputChange}
//           maxLength={100}
//           required
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//           placeholder="Brief description of the feedback"
//           disabled={submitting}
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           {formData.title.length}/100 characters
//         </p>
//       </div>

//       <div>
//         <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//           Description *
//         </label>
//         <textarea
//           id="description"
//           name="description"
//           value={formData.description}
//           onChange={handleInputChange}
//           maxLength={500}
//           required
//           rows={4}
//           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
//           placeholder="Detailed description of the feedback"
//           disabled={submitting}
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           {formData.description.length}/500 characters
//         </p>
//       </div>

//       <button
//         type="submit"
//         disabled={submitting || !formData.title.trim() || !formData.description.trim()}
//         className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//       >
//         {submitting ? (
//           <div className="flex items-center justify-center">
//             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Submitting...
//           </div>
//         ) : (
//           'Submit Feedback'
//         )}
//       </button>
//     </form>
//   );
// }
