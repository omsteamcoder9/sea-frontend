'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { quickSearchProducts } from '@/lib/productService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react';
import { Category } from '@/types/category';
import CartDrawer from '@/components/CartDrawer';

interface SearchProduct {
  _id: string;
  name: string;
  slug: string;
  basePrice: number;
  image: string | null;
  category: string;
  featured: boolean;
}

interface HeaderClientProps {
  categories: Category[];
}

export default function HeaderClient({ categories }: HeaderClientProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const categoryNames = categories.map(cat => cat.name);
  const cartCount = cart?.totalItems || 0;

  const openCartDrawer = () => {
    setIsCartDrawerOpen(true);
  };

  const closeCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  // Get user initial for avatar - safely handle user object
  const getUserInitial = () => {
    if (!user) return 'U';
    const email = (user as any)?.email || (user as any)?.phone || (user as any)?.mobile;
    if (email && typeof email === 'string') return email.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return '';
    return (user as any)?.name || (user as any)?.email || (user as any)?.phone || '';
  };

  const getUserShortName = () => {
    const displayName = getUserDisplayName();
    if (!displayName) return '';
    if (displayName.includes('@')) return displayName.split('@')[0];
    return displayName;
  };

  // Search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await quickSearchProducts(searchQuery, 5);
        if (response.success) {
          setSearchResults(response.data);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSearchClick = () => {
    setShowSearch(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleProductClick = (product: SearchProduct) => {
    router.push(`/products/${product.slug}`);
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showSearch]);

  // Function to get image URL
  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    const filename = imagePath.split('/').pop();
    return `${process.env.NEXT_PUBLIC_IMG_URL}/${filename}`;
  };

  return (
    <>
      <div className="xl:sticky xl:top-0 z-40">
        <header className="font-sans" style={{ backgroundColor: '#014F56', borderBottom: '1px solid rgba(46, 196, 182, 0.2)' }}>
          <div className="container mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Logo and Mobile Menu Button */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="xl:hidden p-1.5 transition-all duration-300 rounded-lg cursor-pointer"
                  style={{ color: '#E9F5F5' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                {/* Logo */}
                <Link href="/" className="flex items-center group cursor-pointer">
                  <span className="text-xl sm:text-2xl font-bold drop-shadow-lg transition-transform duration-200 group-hover:scale-105" style={{ color: '#2EC4B6' }}>
                    Sea Food
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden xl:flex items-center space-x-4 2xl:space-x-6">
                {categoryNames.map((cat) => (
                  <Link 
                    key={cat} 
                    href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center space-x-1 transition-all duration-300 font-medium px-3 py-2 rounded-lg text-sm 2xl:text-base cursor-pointer"
                    style={{ color: '#E9F5F5' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)';
                      e.currentTarget.style.color = '#2EC4B6';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#E9F5F5';
                    }}
                  >
                    <span>{cat}</span>
                  </Link>
                ))}
              </nav>

              {/* Icons */}
              <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3">
                {/* Search Button */}
                <div ref={searchContainerRef} className="relative">
                  {!showSearch ? (
                    <button 
                      onClick={handleSearchClick}
                      className="p-1.5 transition-all duration-300 rounded-lg cursor-pointer"
                      style={{ color: '#E9F5F5' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="absolute right-0 top-0 mt-0 xl:relative">
                      <div className="fixed inset-0 xl:relative xl:inset-auto z-50 flex items-center justify-center xl:block">
                        <div className="xl:hidden fixed inset-0 bg-[#014F56]/95 pt-24">
                          <div className="container mx-auto px-4">
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex-1 flex items-center bg-[#E9F5F5]/10 backdrop-blur-sm rounded-lg px-4 py-2 border" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}>
                                <Search className="w-5 h-5 text-[#E9F5F5] mr-3 flex-shrink-0" />
                                <input
                                  ref={searchInputRef}
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  placeholder="Search products..."
                                  className="flex-1 bg-transparent text-[#E9F5F5] focus:outline-none text-base placeholder-[#E9F5F5]/60 w-full"
                                  autoFocus
                                />
                                {searchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="ml-2 p-1 text-[#E9F5F5]/70 hover:text-[#E9F5F5] rounded-full hover:bg-[#E9F5F5]/10"
                                  >
                                    <X className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                              
                              <button
                                type="submit"
                                onClick={handleSearchSubmit}
                                className="p-3 bg-[#E9F5F5]/10 backdrop-blur-sm hover:bg-[#2EC4B6] text-[#E9F5F5] rounded-lg transition-all duration-300 flex items-center justify-center border" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}
                              >
                                <Search className="w-5 h-5" />
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  setShowSearch(false);
                                  setSearchQuery('');
                                  setSearchResults([]);
                                }}
                                className="p-3 text-[#E9F5F5]/70 hover:text-[#E9F5F5] hover:bg-[#E9F5F5]/10 rounded-lg transition-all duration-300 border" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}
                              >
                                <X className="w-6 h-6" />
                              </button>
                            </div>

                            {(searchResults.length > 0 || isSearching) && (
                              <div className="bg-[#014F56] border rounded-lg shadow-2xl max-h-[60vh] overflow-y-auto" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}>
                                {isSearching ? (
                                  <div className="p-4 text-center text-[#E9F5F5]">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2EC4B6] mx-auto"></div>
                                    <p className="mt-2 text-sm">Searching...</p>
                                  </div>
                                ) : (
                                  <>
                                    <div className="p-2">
                                      <p className="text-xs text-[#E9F5F5]/70 font-medium px-2 py-1 border-b" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}>Search Results</p>
                                      {searchResults.map((product) => (
                                        <div
                                          key={product._id}
                                          className="flex items-center p-2 hover:bg-[#E9F5F5]/10 rounded-lg cursor-pointer transition-colors"
                                          onClick={() => handleProductClick(product)}
                                        >
                                          <div className="w-12 h-12 bg-[#E9F5F5]/10 rounded-lg flex-shrink-0 overflow-hidden border relative" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}>
                                            {product.image ? (
                                              <Image
                                                src={getImageUrl(product.image) || ''}
                                                className="w-full h-full object-cover"
                                                alt={product.name}
                                                fill
                                                sizes="48px"
                                              />
                                            ) : (
                                              <div className="w-full h-full bg-[#E9F5F5]/10 flex items-center justify-center">
                                                <ShoppingCart className="w-6 h-6 text-[#E9F5F5]/70" />
                                              </div>
                                            )}
                                          </div>
                                          <div className="ml-3 flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#E9F5F5] truncate">{product.name}</p>
                                            <div className="flex items-center justify-between">
                                              <p className="text-xs text-[#2EC4B6]">{product.category}</p>
                                              <p className="text-[#E9F5F5] font-medium text-sm">₹{product.basePrice}</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div
                                      className="border-t p-3 bg-[#E9F5F5]/5 hover:bg-[#E9F5F5]/10 cursor-pointer text-center rounded-b-lg transition-all duration-300" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}
                                      onClick={handleViewAllResults}
                                    >
                                      <p className="text-sm font-medium text-[#E9F5F5] hover:text-[#2EC4B6]">
                                        View all results for &quot;{searchQuery}&quot;
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="hidden xl:block absolute top-0 xl:relative w-full max-w-[90vw] sm:max-w-[400px] xl:w-80 2xl:w-96 mx-auto xl:mx-0">
                          <div className="bg-[#E9F5F5]/10 backdrop-blur-sm rounded-lg shadow-xl border p-2" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}>
                            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                              <div className="flex-1 flex items-center bg-[#E9F5F5]/5 rounded-md px-3 py-1.5 border" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}>
                                <Search className="w-4 h-4 text-[#E9F5F5]/70 mr-2 flex-shrink-0" />
                                <input
                                  ref={searchInputRef}
                                  type="text"
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  placeholder="Search products..."
                                  className="flex-1 bg-transparent text-[#E9F5F5] focus:outline-none text-sm placeholder-[#E9F5F5]/60 w-full min-w-0"
                                  autoFocus
                                />
                                {searchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="ml-1 p-0.5 text-[#E9F5F5]/70 hover:text-[#E9F5F5] rounded-full hover:bg-[#E9F5F5]/10"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            
                              <button
                                type="submit"
                                className="p-2 bg-[#E9F5F5]/10 hover:bg-[#2EC4B6] text-[#E9F5F5] rounded-md transition-all duration-300 flex items-center justify-center border hover:scale-105" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}
                              >
                                <Search className="w-4 h-4" />
                              </button>
                            </form>

                            {(searchResults.length > 0 || isSearching) && (
                              <div className="absolute top-full left-0 right-0 mt-2 bg-[#014F56] border rounded-lg shadow-2xl z-50 max-h-80 overflow-y-auto" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}>
                                {isSearching ? (
                                  <div className="p-4 text-center text-[#E9F5F5]">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2EC4B6] mx-auto"></div>
                                    <p className="mt-2 text-sm">Searching...</p>
                                  </div>
                                ) : (
                                  <>
                                    <div className="p-2">
                                      <p className="text-xs text-[#E9F5F5]/70 font-medium px-2 py-1 border-b" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}>Search Results</p>
                                      {searchResults.map((product) => (
                                        <div
                                          key={product._id}
                                          className="flex items-center p-2 hover:bg-[#E9F5F5]/10 rounded-lg cursor-pointer transition-colors"
                                          onClick={() => handleProductClick(product)}
                                        >
                                          <div className="w-10 h-10 bg-[#E9F5F5]/10 rounded-md flex-shrink-0 overflow-hidden border relative" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}>
                                            {product.image ? (
                                              <Image
                                                src={getImageUrl(product.image) || ''}
                                                className="w-full h-full object-cover"
                                                alt={product.name}
                                                fill
                                                sizes="40px"
                                              />
                                            ) : (
                                              <div className="w-full h-full bg-[#E9F5F5]/10 flex items-center justify-center">
                                                <ShoppingCart className="w-5 h-5 text-[#E9F5F5]/70" />
                                              </div>
                                            )}
                                          </div>
                                          <div className="ml-3 flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[#E9F5F5] truncate">{product.name}</p>
                                            <div className="flex items-center justify-between">
                                              <p className="text-xs text-[#2EC4B6]">{product.category}</p>
                                              <p className="text-[#E9F5F5] font-medium text-sm">₹{product.basePrice}</p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div
                                      className="border-t p-3 bg-[#E9F5F5]/5 hover:bg-[#E9F5F5]/10 cursor-pointer text-center rounded-b-lg transition-all duration-300" style={{ borderColor: 'rgba(46, 196, 182, 0.3)' }}
                                      onClick={handleViewAllResults}
                                    >
                                      <p className="text-sm font-medium text-[#E9F5F5] hover:text-[#2EC4B6]">
                                        View all results for &quot;{searchQuery}&quot;
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Button - Hidden when search is active */}
                {!showSearch && (
                  <button 
                    onClick={openCartDrawer}
                    className="p-1.5 transition-all duration-300 rounded-lg relative group cursor-pointer"
                    style={{ color: '#E9F5F5' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-sm" style={{ backgroundColor: '#2EC4B6', color: '#014F56' }}>
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </button>
                )}
                
                {/* Profile / Auth - Hidden when search is active */}
                {!showSearch && (
                  <>
                    {isAuthenticated ? (
                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="flex items-center space-x-1 sm:space-x-2 transition-all duration-300 rounded-lg p-1.5 cursor-pointer"
                          style={{ color: '#E9F5F5' }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-md" style={{ background: 'linear-gradient(135deg, #2EC4B6, #014F56)', color: '#E9F5F5', border: '1px solid rgba(46, 196, 182, 0.3)' }}>
                            {getUserInitial()}
                          </div>
                          <span className="hidden lg:block font-medium text-sm" style={{ color: '#E9F5F5' }}>
                            {getUserShortName()}
                          </span>
                          <svg
                            className={`hidden lg:block w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                            style={{ color: '#E9F5F5' }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isDropdownOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setIsDropdownOpen(false)}
                            />
                            <div className="absolute right-0 mt-4 w-48 rounded-lg shadow-xl py-2 z-20 overflow-hidden" style={{ backgroundColor: '#014F56', border: '1px solid rgba(46, 196, 182, 0.3)' }}>
                              <div className="px-3 py-2 border-b" style={{ borderBottomColor: 'rgba(46, 196, 182, 0.3)', backgroundColor: 'rgba(46, 196, 182, 0.1)' }}>
                                <p className="font-bold text-sm truncate" style={{ color: '#2EC4B6' }}>{getUserDisplayName() || 'User'}</p>
                                <p className="text-xs" style={{ color: '#E9F5F5' }}>Welcome back!</p>
                              </div>
                              <Link
                                href="/orders"
                                className="flex items-center space-x-2 px-3 py-2 text-sm transition-colors"
                                style={{ color: '#E9F5F5' }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)';
                                  e.currentTarget.style.color = '#2EC4B6';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#E9F5F5';
                                }}
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>My Orders</span>
                              </Link>
                              <button
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  openCartDrawer();
                                }}
                                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm transition-colors"
                                style={{ color: '#E9F5F5' }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)';
                                  e.currentTarget.style.color = '#2EC4B6';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#E9F5F5';
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 18v3" />
                                </svg>
                                <span>Cart ({cartCount})</span>
                              </button>
                              <button
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  logout();
                                }}
                                className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm transition-colors rounded-b-lg"
                                style={{ color: '#E9F5F5' }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)';
                                  e.currentTarget.style.color = '#2EC4B6';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                  e.currentTarget.style.color = '#E9F5F5';
                                }}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <Link
                        href="/login"
                        className="px-2 py-1.5 rounded-md transition-all duration-300 font-medium shadow hover:shadow-md text-xs sm:text-sm whitespace-nowrap cursor-pointer min-w-[45px] sm:min-w-[50px] text-center"
                        style={{ backgroundColor: '#2EC4B6', color: '#014F56' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E9F5F5'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
                      >
                        Login
                      </Link>
                    )}
                  </>
                )}

                <button 
                  className="xl:hidden p-1.5 transition-all duration-300 rounded-lg cursor-pointer"
                  style={{ color: '#E9F5F5' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="xl:hidden fixed inset-0 z-50">
                <div 
                  className="absolute inset-0 bg-black/50"
                  onClick={() => setIsMenuOpen(false)}
                />
                
                <div className="absolute top-0 left-0 h-full w-64 shadow-2xl" style={{ background: 'linear-gradient(135deg, #014F56, #0a6b6b)' }}>
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b" style={{ borderBottomColor: 'rgba(46, 196, 182, 0.3)', backgroundColor: 'rgba(46, 196, 182, 0.1)' }}>
                      <Link 
                        href="/" 
                        className="flex items-center space-x-2 group cursor-pointer"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="font-bold text-lg drop-shadow-md" style={{ color: '#2EC4B6' }}>Sea Food</span>
                      </Link>
                      <button
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1.5 transition-all duration-300 rounded-lg cursor-pointer"
                        style={{ color: '#E9F5F5' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <nav className="flex-1 p-4 overflow-y-auto">
                      <div className="space-y-1">
                        {categoryNames.map((cat) => (
                          <Link
                            key={cat}
                            href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center space-x-3 transition-all duration-300 font-medium p-3 rounded-lg text-sm cursor-pointer"
                            style={{ color: '#E9F5F5' }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)';
                              e.currentTarget.style.color = '#2EC4B6';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#E9F5F5';
                            }}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span>{cat}</span>
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            setIsMenuOpen(false);
                            openCartDrawer();
                          }}
                          className="flex items-center space-x-3 w-full text-left transition-all duration-300 font-medium p-3 rounded-lg text-sm cursor-pointer"
                          style={{ color: '#E9F5F5' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)';
                            e.currentTarget.style.color = '#2EC4B6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#E9F5F5';
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Cart ({cartCount})</span>
                        </button>
                      </div>
                    </nav>

                    <div className="p-4 border-t" style={{ borderTopColor: 'rgba(46, 196, 182, 0.3)', backgroundColor: 'rgba(46, 196, 182, 0.05)' }}>
                      {isAuthenticated ? (
                        <div className="flex items-center space-x-3 p-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md" style={{ background: 'linear-gradient(135deg, #2EC4B6, #014F56)', color: '#E9F5F5', border: '1px solid rgba(46, 196, 182, 0.3)' }}>
                            {getUserInitial()}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm truncate" style={{ color: '#2EC4B6' }}>{getUserShortName()}</p>
                            <p className="text-xs" style={{ color: '#E9F5F5' }}>Welcome back!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Link
                            href="/login"
                            className="flex-1 text-center py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                            style={{ backgroundColor: '#2EC4B6', color: '#014F56' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E9F5F5'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2EC4B6'}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            href="/signup"
                            className="flex-1 text-center py-2 rounded-lg transition-all duration-300 text-sm font-medium"
                            style={{ backgroundColor: 'rgba(46, 196, 182, 0.2)', color: '#E9F5F5', border: '1px solid rgba(46, 196, 182, 0.3)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.3)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(46, 196, 182, 0.2)'}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>

      {/* Bottom Navigation Footer - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 border-t shadow-lg z-40 xl:hidden" style={{ backgroundColor: '#014F56', borderTopColor: 'rgba(46, 196, 182, 0.3)' }}>
        <div className="container mx-auto px-2">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex flex-col items-center justify-center flex-1 p-1 transition-colors cursor-pointer min-w-0" style={{ color: '#E9F5F5' }}>
              <svg className="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-medium truncate w-full text-center">Home</span>
            </Link>

            {/* Search Button in Bottom Navigation */}
            <button 
              onClick={handleSearchClick}
              className="flex flex-col items-center justify-center flex-1 p-1 transition-colors cursor-pointer min-w-0" style={{ color: '#E9F5F5' }}
            >
              <Search className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-medium truncate w-full text-center">Search</span>
            </button>

            <button
              onClick={openCartDrawer}
              className="flex flex-col items-center justify-center flex-1 p-1 transition-colors relative cursor-pointer min-w-0" style={{ color: '#E9F5F5' }}
            >
              <ShoppingCart className="w-4 h-4 mb-0.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 right-4 rounded-full h-4 w-4 flex items-center justify-center font-bold shadow border" style={{ backgroundColor: '#2EC4B6', color: '#014F56', borderColor: '#E9F5F5' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
              <span className="text-[10px] font-medium truncate w-full text-center">Cart</span>
            </button>

            {isAuthenticated ? (
              <Link href="/orders" className="flex flex-col items-center justify-center flex-1 p-1 transition-colors cursor-pointer min-w-0" style={{ color: '#E9F5F5' }}>
                <div className="w-4 h-4 rounded-full flex items-center justify-center font-bold text-[10px] mb-0.5 shadow border" style={{ background: 'linear-gradient(135deg, #2EC4B6, #014F56)', color: '#E9F5F5', borderColor: 'rgba(46, 196, 182, 0.3)' }}>
                  {getUserInitial()}
                </div>
                <span className="text-[10px] font-medium truncate w-full text-center">Account</span>
              </Link>
            ) : (
              <Link href="/login" className="flex flex-col items-center justify-center flex-1 p-1 transition-colors cursor-pointer min-w-0" style={{ color: '#E9F5F5' }}>
                <User className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] font-medium truncate w-full text-center">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={closeCartDrawer} 
      />
    </>
  );
}