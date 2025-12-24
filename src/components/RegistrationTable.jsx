// 'use client';

// import React, { useState } from "react";
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster

// // AvatarImage client component for fallback avatar
// function AvatarImage({ src, alt }) {
//   const [imgSrc, setImgSrc] = useState(src);
//   return (
//     <img
//       className="h-full w-full object-cover"
//       src={imgSrc}
//       alt={alt}
//       onError={() =>
//         setImgSrc("https://placehold.co/40x40/CCCCCC/000000?text=NA")
//       }
//     />
//   );
// }

// // Main App component
// export default function UserList() {
//   const router = useRouter();

//   // Initial user data without 'role'
//   const initialUsers = [
//     {
//       id: "5089",
//       customer: {
//         name: "Jane Cooper",
//         avatar: "https://images.pexels.com/photos/1250655/pexels-photo-1250655.jpeg",
//       },
//       joinDate: "6 April, 2023",
//       status: "Active",
//       email: "jane.cooper@example.com",
//       phone: "664 333 224",
//     },
//     {
//       id: "5090",
//       customer: {
//         name: "Jerome Bell",
//         avatar: "https://placehold.co/40x40/33FF57/FFFFFF?text=JB",
//       },
//       joinDate: "6 April, 2023",
//       status: "Blocked",
//       email: "jerome.bell@example.com",
//       phone: "123 456 789",
//     },
//     {
//       id: "5091",
//       customer: {
//         name: "Jenny Wilson",
//         avatar: "https://placehold.co/40x40/5733FF/FFFFFF?text=JW",
//       },
//       joinDate: "6 April, 2023",
//       status: "Active",
//       email: "jenny.wilson@example.com",
//       phone: "987 654 321",
//     },
//     {
//       id: "5092",
//       customer: {
//         name: "Ralph Edwards",
//         avatar: "https://placehold.co/40x40/FF33A1/FFFFFF?text=RE",
//       },
//       joinDate: "6 April, 2023",
//       status: "Blocked",
//       email: "ralph.edwards@example.com",
//       phone: "555 123 456",
//     },
//   ];

//   // State for all functionalities
//   const [users, setUsers] = useState(initialUsers);
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("All");
//   const [dateRange, setDateRange] = useState({ from: "", to: "" });
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const [showDateFilter, setShowDateFilter] = useState(false);

//   // State for the confirmation modal (for unblock)
//   const [showConfirmation, setShowConfirmation] = useState(false);
//   const [userToUnblock, setUserToUnblock] = useState(null);

//   // Helper: parse date string to Date object
//   function parseDate(str) {
//     const [day, monthStr, year] = str.replace(",", "").split(" ");
//     return new Date(`${year}-${("0" + (new Date(`${monthStr} 1`).getMonth() + 1)).slice(-2)}-${("0" + day).slice(-2)}`);
//   }

//   // Filtered users
//   let filtered = users.filter((u) => {
//     const searchMatch =
//       u.customer.name.toLowerCase().includes(search.toLowerCase()) ||
//       u.id.toLowerCase().includes(search.toLowerCase());
//     const statusMatch = status === "All" || u.status === status;
//     let dateMatch = true;
//     if (showDateFilter) {
//       if (dateRange.from) {
//         dateMatch = dateMatch && parseDate(u.joinDate) >= new Date(dateRange.from);
//       }
//       if (dateRange.to) {
//         dateMatch = dateMatch && parseDate(u.joinDate) <= new Date(dateRange.to);
//       }
//     }
//     return searchMatch && statusMatch && dateMatch;
//   });

//   // Pagination
//   const total = filtered.length;
//   const totalPages = Math.ceil(total / pageSize);
//   const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

//   // Handlers
//   const handleSearch = (e) => {
//     setSearch(e.target.value);
//     setPage(1);
//   };
//   const handleStatus = (e) => {
//     setStatus(e.target.value);
//     setPage(1);
//   };
//   const handlePageSize = (e) => {
//     setPageSize(Number(e.target.value));
//     setPage(1);
//   };
//   const handleDateChange = (e) => {
//     setDateRange({ ...dateRange, [e.target.name]: e.target.value });
//     setPage(1);
//   };
//   const handlePage = (p) => {
//     if (p >= 1 && p <= totalPages) setPage(p);
//   };

//   const handleView = (user) => {
//     router.push(`/admin/user-list/${user.id}`);
//     toast.success(`Navigating to details for ${user.customer.name}`);
//   };

//   const handleDelete = (user) => {
//     toast.custom((t) => (
//       <div
//         className={`${t.visible ? 'animate-enter' : 'animate-leave'}
//           max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
//       >
//         <div className="flex-1 w-0 p-4">
//           <div className="flex items-start">
//             <div className="flex-shrink-0 pt-0.5">
//               <AvatarImage src={user.customer.avatar} alt={user.customer.name} />
//             </div>
//             <div className="ml-3 flex-1">
//               <p className="text-sm font-medium text-black">
//                 Confirm Deletion
//               </p>
//               <p className="mt-1 text-sm text-gray-500">
//                 Are you sure you want to delete {user.customer.name}? This action cannot be undone.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="flex border-l border-gray-200">
//           <button
//             onClick={() => {
//               setUsers((prev) => prev.filter((u) => u.id !== user.id));
//               toast.dismiss(t.id);
//               toast.success(`${user.customer.name} has been deleted!`);
//             }}
//             className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
//           >
//             Delete
//           </button>
//           <button
//             onClick={() => toast.dismiss(t.id)}
//             className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     ), { duration: Infinity });
//   };

//   const handleBlockUnblock = (user) => {
//     const newStatus = user.status === "Active" ? "Blocked" : "Active";
//     setUsers((prev) =>
//       prev.map((u) =>
//         u.id === user.id
//           ? { ...u, status: newStatus }
//           : u
//       )
//     );
//     toast.success(`${user.customer.name} has been ${newStatus.toLowerCase()}!`);
//     setShowConfirmation(false); // Close modal after action, if it was open
//     setUserToUnblock(null);
//   };

//   const handleBlockUnblockClick = (user) => {
//     // Only show the original confirmation modal if trying to unblock
//     if (user.status === "Blocked") {
//       setUserToUnblock(user);
//       setShowConfirmation(true);
//     } else {
//       // If blocking, proceed directly and use hot-toast for notification
//       handleBlockUnblock(user);
//     }
//   };

//   const handleCancelUnblock = () => {
//     setShowConfirmation(false);
//     setUserToUnblock(null);
//     toast('Unblock cancelled.', { icon: '👋' });
//   };


//   return (
//     <>
//       <div className="bg-white text-black  p-6">
//         <h2 className="text-xl sm:text-2xl font-semibold pb-5">User List</h2>

//         <div className="w-full text-black px-6 py-5 bg-white rounded shadow-xl">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead>
//                 <tr>
//                   <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
//                   <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <div className="flex items-center">Customer
//                       <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
//                         <path opacity="0.4" d="M16.18 13.4399L12.39 8.38989H6.78C5.82 8.38989 5.34 9.54989 6.02 10.2299L11.2 15.4099C12.03 16.2399 13.38 16.2399 14.21 15.4099L16.18 13.4399Z" fill="#808080" />
//                         <path d="M18.62 8.38989H12.39L16.18 13.4399L19.39 10.2299C20.06 9.54989 19.58 8.38989 18.62 8.38989Z" fill="#808080" />
//                       </svg>
//                     </div>
//                   </th>
//                   <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
//                   <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-3 py-3 sm:px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {paginated.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td>
//                   </tr>
//                 ) : (
//                   paginated.map((user, index) => (
//                     <tr key={user.id}>
//                       <td className="px-3 py-3 sm:px-6 whitespace-nowrap text-sm font-medium text-gray-700">#{user.id}</td>
//                       <td className="px-3 py-3 sm:px-6 whitespace-nowrap">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 rounded-full overflow-hidden">
//                             <AvatarImage src={user.customer.avatar} alt={user.customer.name} />
//                           </div>
//                           <div className="ml-2 sm:ml-4">
//                             <div className="text-sm font-medium text-gray-900">{user.customer.name}</div>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-3 py-3 sm:px-6 whitespace-nowrap text-sm text-gray-700">{user.joinDate}</td>
//                       <td className="px-3 py-3 sm:px-6 whitespace-nowrap">
//                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === "Active" ? "text-green-600" : "text-red-600"}`}>{user.status}</span>
//                       </td>
//                       <td className="px-3 py-3 sm:px-6 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           {/* Eye icon for view */}
//                           <button onClick={() => handleView(user)} title="View details">
//                             <svg className="h-5 w-5 text-indigo-600 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
//                             </svg>
//                           </button>
//                           {/* Action icon based on status */}
//                           {user.status === "Active" ? (
//                             <button onClick={() => handleBlockUnblockClick(user)} title="Block user">
//                               <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" className="cursor-pointer">
//                                 <g clipPath="url(#clip0_0_736)">
//                                   <path d="M7.6001 0.209961C3.75283 0.209961 0.600098 3.3627 0.600098 7.20996C0.600098 11.0572 3.75283 14.21 7.6001 14.21C11.4474 14.21 14.6001 11.0572 14.6001 7.20996C14.6001 3.3627 11.4474 0.209961 7.6001 0.209961ZM2.26807 7.20996C2.26807 4.27321 4.66335 1.87793 7.6001 1.87793C8.70749 1.87793 9.77395 2.22243 10.6845 2.87048L7.6001 5.95486L3.26067 10.2943C2.61257 9.38376 2.26807 8.31736 2.26807 7.20996ZM7.6001 12.542C6.4927 12.542 5.42624 12.1974 4.51572 11.5494L11.9396 4.12556C12.5876 5.03611 12.9321 6.10251 12.9321 7.20996C12.9321 10.1467 10.5368 12.542 7.6001 12.542Z" fill="#DC2626" />
//                                 </g>
//                                 <defs>
//                                   <clipPath id="clip0_0_736">
//                                     <rect width="14" height="14" fill="white" transform="translate(0.600098 0.209961)" />
//                                   </clipPath>
//                                 </defs>
//                               </svg>
//                             </button>
//                           ) : (
//                             <button onClick={() => handleBlockUnblockClick(user)} title="Unblock user">
//                               <svg className="h-5 w-5 text-green-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
//                               </svg>
//                             </button>
//                           )}
//                           {/* Delete icon */}
//                           {/* <button onClick={() => handleDelete(user)} title="Delete user">
//                             <svg className="h-5 w-5 text-red-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                           </button> */}
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <AnimatePresence>
//             {showConfirmation && (
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
//               >
//                 <motion.div
//                   initial={{ scale: 0.9, y: 50 }}
//                   animate={{ scale: 1, y: 0 }}
//                   exit={{ scale: 0.9, y: 50 }}
//                   className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center"
//                 >
//                   <h3 className="text-xl font-semibold mb-4 text-black">Are you sure !</h3>
//                   {userToUnblock && (
//                     <p className="text-gray-700 mb-6">You want to Unblock {userToUnblock.customer.name}?</p>
//                   )}
//                   <div className="flex justify-center space-x-4">
//                     <button
//                       onClick={handleCancelUnblock}
//                       className="px-6 py-2 rounded-lg text-gray-700 border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={() => handleBlockUnblock(userToUnblock)}
//                       className="px-6 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
//                     >
//                       Confirm
//                     </button>
//                   </div>
//                 </motion.div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//           <Toaster />
//         </div>
//       </div>
//     </>
//   );
// }