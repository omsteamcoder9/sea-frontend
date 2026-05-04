// app/blogs/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import blogService from '@/lib/blogService';
import { Blog } from '@/types/blog';
import { FiCalendar, FiUser, FiClock, FiEye, FiHeart, FiMessageSquare, FiShare2, FiArrowLeft } from 'react-icons/fi';
import { HiOutlineTag } from 'react-icons/hi';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const slug = params.slug as string;

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogBySlug(slug);
      if (response.success) {
        setBlog(response.data);
        setLikesCount(response.data.likes?.length || 0);
        fetchRelatedBlogs(response.data._id);
      } else {
        router.push('/blogs');
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      router.push('/blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async (blogId: string) => {
    try {
      const response = await blogService.getRelatedBlogs(blogId, 4);
      if (response.success) {
        setRelatedBlogs(response.data);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const handleLike = async () => {
    if (!blog) return;
    
    try {
      const response = await blogService.toggleLike(blog._id);
      if (response.success) {
        setLiked(response.isLiked);
        setLikesCount(response.likesCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareBlog = () => {
    if (navigator.share && blog) {
      navigator.share({
        title: blog.title,
        text: blog.description,
        url: window.location.href,
      });
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
          <Link href="/blogs" className="text-[#996600] hover:text-[#805500]">
            ← Back to blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to all blogs
          </Link>
        </div>
      </div>

      <div className="py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Blog Header */}
            <div className="mb-8">
              {/* Category */}
              {blog.category && (
                <span className="inline-block bg-gradient-to-r from-[#cc3f0c] to-[#ff7a2f] text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                  {blog.category}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                {blog.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              

                <div className="flex items-center gap-6">
                  <span className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    {formatDate(blog.publishedAt || blog.createdAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <FiClock className="w-4 h-4" />
                    {blog.readTime} min read
                  </span>
              
                </div>
              </div>
            </div>

     {/* Featured Image */}
{blog.image && (
  <div className="mb-8 rounded-lg overflow-hidden border border-gray-200">
    <div className="relative h-72 md:h-80 lg:h-240"> {/* Adjust heights as needed */}
      <Image
        src={`${process.env.NEXT_PUBLIC_IMG_URL}/${blog.image}`}
        alt={blog.imageAlt || blog.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 300vw, (max-width: 1200px) 100vw, 100vw"
        priority
      />
    </div>
  </div>
)}
{/* Description */}
{blog.description && (
  <div className="mb-8 bg-gradient-to-r from-amber-50 to-white rounded-lg p-6 border-l-4 border-gradient-to-r border-[#cc3f0c]">
    <h3 className="text-xl font-semibold text-gray-900 mb-3">Article Summary</h3>
    <p className="text-gray-700 leading-relaxed">
      {blog.description}
    </p>
  </div>
)}

{/* Blog Content */}
{blog.content ? (
  <article className="prose prose-lg max-w-none mb-12">
    <h3 className="text-xl font-semibold text-gray-900 mb-4">Full Article</h3>
    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
  </article>
) : (
  <div className="mb-12 text-center py-8 bg-amber-50 rounded-lg">
    <svg className="w-12 h-12 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p className="text-gray-600">No detailed content available.</p>
    <p className="text-sm text-gray-500 mt-2">Showing description instead.</p>
  </div>
)}

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <HiOutlineTag className="w-5 h-5 text-[#996600]" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>


<div className="border-t border-gray-200 py-12">
  <div className="container mx-auto px-4">
<h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
  {relatedBlogs.length > 0 ? "Related Blogs" : "Recent Articles"}
</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedBlogs.map((relatedBlog) => (
        <Link 
          href={`/blogs/${relatedBlog.slug}`} 
          key={relatedBlog._id}
          className="group block"
        >
          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            {relatedBlog.image && (
              <div className="relative h-48">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMG_URL}/${relatedBlog.image}`}
                  alt={relatedBlog.imageAlt || relatedBlog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            )}
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 transition-colors">
                {relatedBlog.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {relatedBlog.description}
              </p>

            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</div>
    </div>
  );
}