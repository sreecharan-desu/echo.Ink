// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import { Post } from '../../types';
// import { api } from '../../services/api';
// import PostCardSkeleton from '../skeletons/PostCardSkeleton';

// export default function Search() {
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<Post[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const searchPosts = async () => {
//       if (query.length < 3) {
//         setResults([]);
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await api.searchPosts(query);
//         console.log(response);
//         setResults(response.posts);
//       } catch (error) {
//         console.error('Search failed:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     const debounce = setTimeout(searchPosts, 300);
//     return () => clearTimeout(debounce);
//   }, [query]);

//   return (
//     <div className="relative w-full max-w-xl hidden">
//       <div className="relative">
//         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//         <input
//           type="text"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onFocus={() => setIsOpen(true)}
//           placeholder="Search stories..."
//           className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
//         />
//       </div>

//       {isOpen && (query.length >= 3) && (
//         <div className="absolute top-full mt-2 w-full bg-[--card] rounded-lg shadow-lg border border-[--border]">
//           {loading ? (
//             <div className="p-4 space-y-4">
//               <PostCardSkeleton />
//               <PostCardSkeleton />
//               <PostCardSkeleton />
//             </div>
//           ) : results.length > 0 ? (
//             results.map((post) => (
//               <button
//                 key={post.id}
//                 onClick={() => {
//                   navigate(`/post/${post.id}`);
//                   setIsOpen(false);
//                   setQuery('');
//                 }}
//                 className="block w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
//               >
//                 <div className="font-medium text-ink-dark">{post.title}</div>
//                 <div className="text-sm text-ink-light mt-1">
//                   by {post.author?.username}
//                 </div>
//               </button>
//             ))
//           ) : (
//             <div className="text-center py-6 text-ink-light">
//               No results found
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// } 