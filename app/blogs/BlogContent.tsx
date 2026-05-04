'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import blogService from '@/lib/blogService';
import { Blog, PaginationParams } from '@/types/blog';
import { FiSearch, FiCalendar, FiUser, FiClock, FiEye, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiOutlineTag, HiOutlineFilter } from 'react-icons/hi';

export default function BlogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 12
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, [searchParams]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      
      // Add cache busting timestamp - THIS FORCES FRESH DATA
      const timestamp = Date.now();
      
      const params: PaginationParams = {
        page: parseInt(searchParams.get('page') || '1'),
        limit: 12,
        sort: '-updatedAt', // This shows both new AND updated blogs
      };

      console.log('🔄 Fetching fresh blogs data with timestamp:', timestamp);
      
      const response = await blogService.getBlogs(params);
      console.log('✅ Received blogs:', response.data.length);
      
      setBlogs(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
        limit: 12
      });
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    router.push(`/blogs?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    router.push(`/blogs?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    router.push('/blogs');
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && blogs.length === 0) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#cc3f0c] to-[#ff7a2f] text-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Our Blog</h1>
            <p className="text-lg sm:text-xl opacity-90 mb-8">
              Discover insights, tips, and stories from our community
            </p>
          </div>
        </div>
      </div>

      <div className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content - FULL WIDTH NOW */}
            <div className="w-full">
              {/* Stats */}
              <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {pagination.totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-gray-700">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              {blogs.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600 mb-6">
                    Check back soon for new articles!
                  </p>
                </div>
              ) : (
                <>
                  {/* Blog Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {blogs.map((blog) => (
                      <article key={blog._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col h-full">
                        {/* Image - Full width, natural height */}
                        <Link href={`/blogs/${blog.slug}`} className="block w-full bg-gray-50 relative">
                          {blog.image ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMG_URL}/${blog.image}`}
                              alt={blog.imageAlt || blog.title}
                              className="w-full h-auto block"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full aspect-video bg-gray-200 flex items-center justify-center">
                              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          
                          {/* Category Badge (if exists) */}
                          {blog.category && (
                            <div className="absolute top-3 right-3">
                              <span className="bg-gradient-to-r from-[#cc3f0c] to-[#ff7a2f] text-white px-3 py-1 rounded-full text-xs font-medium">
                                {blog.category}
                              </span>
                            </div>
                          )}
                        </Link>

                        {/* Content - Flexible height */}
                        <div className="p-6 flex flex-col flex-grow">
                          {/* Meta Info */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="w-4 h-4" />
                              {formatDate(blog.publishedAt || blog.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock className="w-4 h-4" />
                              {blog.readTime} min read
                            </span>
                          </div>

                          {/* Title */}
                          <Link href={`/blogs/${blog.slug}`}>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-[#cc3f0c] transition-colors duration-200 line-clamp-2">
                              {blog.title}
                            </h3>
                          </Link>

                          {/* Excerpt */}
                          <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
                            {blog.description}
                          </p>

                          {/* Tags */}
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-auto pt-4">
                              {blog.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.totalPages > 1 && (
                    <div className="mt-12 flex justify-center">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (pagination.currentPage >= pagination.totalPages - 2) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.currentPage - 2 + i;
                          }
                          
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 rounded-lg border transition-colors duration-200 ${
                                pagination.currentPage === pageNum 
                                  ? 'bg-gradient-to-r from-[#cc3f0c] to-[#ff7a2f] text-white border-gradient-to-r border-[#cc3f0c]' 
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}
                        
                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}