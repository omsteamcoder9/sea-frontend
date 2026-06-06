'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { quickSearchProducts } from '@/lib/productService';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Menu, X, User, Search, Instagram, Twitter, Facebook, Youtube, Linkedin, Phone, Mail, ChevronDown } from 'lucide-react';
import { Category } from '@/types/category';
import CartDrawer from '@/components/CartDrawer';
import { settingsAPI } from '@/lib/settings-api';

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
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  
  // Site settings state
  const [siteName, setSiteName] = useState('Sea Food');
  const [contactEmail, setContactEmail] = useState('contact@seafood.com');
  const [contactNumber, setContactNumber] = useState('+91 98765 43210');
  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    linkedin: ''
  });
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  
  const categoryNames = categories.map(cat => cat.name);
  const cartCount = cart?.totalItems || 0;

  // Get first 3 categories to show directly
  const displayedCategories = categories.slice(0, 3);
  // Get remaining categories for dropdown
  const dropdownCategories = categories.slice(3);

  // Fetch settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.getPublicSettings();
      if (response.success && response.data) {
        const data = response.data;
        
        // Update site name
        if (data.siteName) {
          setSiteName(data.siteName);
        }
        
        // Update contact info
        if (data.contactEmail) {
          setContactEmail(data.contactEmail);
        }
        if (data.contactNumber) {
          setContactNumber(data.contactNumber);
        }
        
        // Update social media
        if (data.socialMedia) {
          setSocialMedia({
            facebook: data.socialMedia.facebook || '',
            instagram: data.socialMedia.instagram || '',
            twitter: data.socialMedia.twitter || '',
            youtube: data.socialMedia.youtube || '',
            linkedin: data.socialMedia.linkedin || ''
          });
        }
        
        // Also handle frontend format if needed
        if (data.facebookUrl) {
          setSocialMedia(prev => ({ ...prev, facebook: data.facebookUrl || '' }));
        }
        if (data.instagramUrl) {
          setSocialMedia(prev => ({ ...prev, instagram: data.instagramUrl || '' }));
        }
        if (data.twitterUrl) {
          setSocialMedia(prev => ({ ...prev, twitter: data.twitterUrl || '' }));
        }
        if (data.youtubeUrl) {
          setSocialMedia(prev => ({ ...prev, youtube: data.youtubeUrl || '' }));
        }
        if (data.linkedinUrl) {
          setSocialMedia(prev => ({ ...prev, linkedin: data.linkedinUrl || '' }));
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Keep default values if fetch fails
    }
  };

  const openCartDrawer = () => {
    setIsCartDrawerOpen(true);
  };

  const closeCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

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

  // Handle category click with proper navigation
  const handleCategoryClick = (category: Category | string) => {
    const categorySlug = typeof category === 'string' ? category : (category.slug || category._id);
    router.push(`/products?category=${encodeURIComponent(categorySlug)}`);
    setIsMenuOpen(false);
    setIsShopDropdownOpen(false);
  };

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

  // Close search when clicking outside (only for desktop)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (window.innerWidth >= 1024) {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
          setShowSearch(false);
          setSearchQuery('');
          setSearchResults([]);
        }
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

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Close shop dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(event.target as Node)) {
        setIsShopDropdownOpen(false);
      }
    };

    if (isShopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShopDropdownOpen]);

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return null;
    const filename = imagePath.split('/').pop();
    return `${process.env.NEXT_PUBLIC_IMG_URL}/${filename}`;
  };

  return (
    <>
      {/* ================= TOP HEADER ================= */}
      <div className="hidden lg:block w-full bg-[#9B0F06]">
        <div className="max-w-[1350px] mx-auto">
          <div className="flex items-center justify-between h-[40px] px-6">
            {/* LEFT SIDE - Email and Phone from DB */}
            <div className="flex items-center gap-8 text-[#EED9B9] text-[12px] font-semibold">
              <div className="flex items-center gap-2">
                <Mail className="w-[12px] h-[12px]" />
                <span>{contactEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-[12px] h-[12px]" />
                <span>{contactNumber}</span>
              </div>
            </div>

            {/* RIGHT SIDE - Contact Link and Social Icons from DB */}
            <div className="flex items-center gap-4 text-[#EED9B9] text-[12px] font-semibold">
              <a href="/contact" className="hover:text-white transition-all duration-300">
                Contact
              </a>
              <div className="flex items-center gap-3">
                {socialMedia.facebook && (
                  <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all duration-300">
                    <Facebook className="w-[12px] h-[12px] cursor-pointer" />
                  </a>
                )}
                {socialMedia.twitter && (
                  <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all duration-300">
                    <Twitter className="w-[12px] h-[12px] cursor-pointer" />
                  </a>
                )}
                {socialMedia.instagram && (
                  <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all duration-300">
                    <Instagram className="w-[12px] h-[12px] cursor-pointer" />
                  </a>
                )}
                {socialMedia.youtube && (
                  <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all duration-300">
                    <Youtube className="w-[12px] h-[12px] cursor-pointer" />
                  </a>
                )}
                {socialMedia.linkedin && (
                  <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-all duration-300">
                    <Linkedin className="w-[12px] h-[12px] cursor-pointer" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN NAVBAR with STICKY ================= */}
      <header className="sticky top-0 z-50 w-full bg-[#5E0006] border-b border-[#D53E0F]/30">
        <div className="w-full lg:max-w-[1350px] lg:mx-auto">
          <div className="flex items-center justify-between lg:grid lg:grid-cols-[220px_1fr_320px] h-[60px] lg:h-[72px] px-0 lg:px-0">
            {/* LEFT LOGO - Dynamic Site Name from DB */}
            <div className="flex items-center px-3 lg:px-6 bg-transparent">
              <Link href="/" className="relative">
                <div className="absolute -top-3 left-0 w-8 lg:w-11 h-[3px] lg:h-[4px] bg-[#D53E0F]"></div>
                <h1 className="text-[20px] lg:text-[28px] font-black tracking-[3px] lg:tracking-[5px] text-[#EED9B9] leading-none">
                  {siteName}
                </h1>
              </Link>
            </div>

            {/* CENTER MENU - Desktop only */}
            <div className="hidden lg:flex items-center justify-center bg-transparent">
              <nav className="hidden xl:flex items-center gap-8">
                <Link
                  href="/"
                  className="text-[12px] font-extrabold tracking-[1px] text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all duration-300"
                >
                  HOME
                </Link>
                {/* Show only first 3 categories */}
                {displayedCategories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => handleCategoryClick(cat)}
                    className="text-[12px] font-extrabold tracking-[1px] text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all duration-300 cursor-pointer"
                  >
                    {cat.name.toUpperCase()}
                  </button>
                ))}
                {/* Shop Dropdown Button - Only show if there are remaining categories */}
                {dropdownCategories.length > 0 && (
                  <div ref={shopDropdownRef} className="relative">
                    <button
                      onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                      className="text-[12px] font-extrabold tracking-[1px] text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all duration-300 cursor-pointer flex items-center gap-1"
                    >
                      SHOP
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isShopDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isShopDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 min-w-[200px] bg-[#5E0006] rounded-lg shadow-2xl py-2 z-20 border border-[#D53E0F]/30 backdrop-blur-sm">
                        {dropdownCategories.map((cat) => (
                          <button
                            key={cat._id}
                            onClick={() => handleCategoryClick(cat)}
                            className="block w-full text-left px-4 py-2.5 text-[13px] font-medium text-[#EED9B9]/90 hover:text-[#D53E0F] hover:bg-white/5 transition-all duration-200"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <Link
                  href="/about"
                  className="text-[12px] font-extrabold tracking-[1px] text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all duration-300"
                >
                  ABOUT
                </Link>
                <Link
                  href="/contact"
                  className="text-[12px] font-extrabold tracking-[1px] text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all duration-300"
                >
                  CONTACT
                </Link>
              </nav>
            </div>

            {/* RIGHT AREA */}
            <div className="bg-transparent flex items-center justify-end px-3 lg:px-8 gap-3 lg:gap-6 h-full">
              {/* When search is NOT active - Show Search Icon, Cart, and Profile */}
              {!showSearch ? (
                <div className="flex items-center gap-3 lg:gap-6">
                  {/* Search Icon */}
                  <button 
                    onClick={handleSearchClick}
                    className="text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all duration-300"
                  >
                    <Search className="w-[18px] h-[18px]" />
                  </button>

                  {/* Cart */}
                  <button 
                    onClick={openCartDrawer}
                    className="text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all duration-300 relative"
                  >
                    <ShoppingCart className="w-[18px] h-[18px]" />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#D53E0F] text-[#EED9B9] rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                        {cartCount > 9 ? '9+' : cartCount}
                      </span>
                    )}
                  </button>

                  {/* Profile / Login Button */}
                  {!isAuthenticated ? (
                    <Link href="/login" className="hidden lg:block">
                      <button className="border border-[#D53E0F]/50 bg-white/10 backdrop-blur-sm h-[40px] px-6 text-[#EED9B9] text-[11px] font-black tracking-[1.5px] uppercase hover:bg-[#D53E0F] hover:text-white transition-all duration-300 rounded-full">
                        LOGIN
                      </button>
                    </Link>
                  ) : (
                    <div ref={profileDropdownRef} className="relative hidden lg:block">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="border border-[#D53E0F]/50 bg-white/10 backdrop-blur-sm h-[40px] px-6 text-[#EED9B9] text-[11px] font-black tracking-[1.5px] uppercase hover:bg-[#D53E0F] hover:text-white transition-all duration-300 rounded-full flex items-center gap-2"
                      >
                        <User className="w-[14px] h-[14px]" />
                        {getUserShortName()}
                      </button>
                      
                      {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100">
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            My Orders
                          </Link>
                    <button
  onClick={() => {
    setIsDropdownOpen(false);
    logout();
    router.push('/');  // ← Add this line to redirect to home
  }}
  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
>
  Logout
</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* When search is active - Show Search Input in place (Desktop only) */
                <div className="hidden lg:block">
                  <div ref={searchContainerRef} className="relative">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-64">
                      <form onSubmit={handleSearchSubmit} className="p-2">
                        <div className="flex items-center gap-1">
                          <div className="flex-1 flex items-center border border-gray-200 rounded-md px-2 py-1">
                            <Search className="w-3.5 h-3.5 text-gray-400 mr-1.5" />
                            <input
                              ref={searchInputRef}
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder="Search..."
                              className="flex-1 text-xs focus:outline-none"
                            />
                            {searchQuery && (
                              <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="text-gray-400 hover:text-gray-600 ml-1"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <button
                            type="submit"
                            className="px-2.5 py-1 bg-[#D53E0F] text-white rounded-md text-[10px] font-medium hover:opacity-80 transition-all whitespace-nowrap"
                          >
                            Go
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowSearch(false);
                              setSearchQuery('');
                              setSearchResults([]);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    {/* Search Results Dropdown */}
                    {(searchResults.length > 0 || isSearching) && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                        {isSearching ? (
                          <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D53E0F] mx-auto"></div>
                            <p className="mt-2 text-xs">Searching...</p>
                          </div>
                        ) : (
                          <>
                            <div className="p-2">
                              {searchResults.map((product) => (
                                <div
                                  key={product._id}
                                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                                  onClick={() => handleProductClick(product)}
                                >
                                  <div className="w-10 h-10 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden relative">
                                    {product.image ? (
                                      <Image
                                        src={getImageUrl(product.image) || ''}
                                        className="w-full h-full object-cover"
                                        alt={product.name}
                                        fill
                                        sizes="40px"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <ShoppingCart className="w-5 h-5 text-gray-400" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-3 flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                  </div>
                                  <p className="text-[#D53E0F] font-medium text-sm">₹{product.basePrice}</p>
                                </div>
                              ))}
                            </div>
                            <div
                              className="border-t border-gray-100 p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer text-center rounded-b-lg"
                              onClick={handleViewAllResults}
                            >
                              <p className="text-sm font-medium text-[#D53E0F]">
                                View all results for &quot;{searchQuery}&quot;
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute top-0 left-0 h-full w-64 bg-[#5E0006] shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-[#D53E0F]/30">
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  <h1 className="text-xl font-black tracking-[3px] text-[#EED9B9]">{siteName}</h1>
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="text-[#EED9B9]/80 hover:text-[#D53E0F]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-2">
                  <Link
                    href="/"
                    className="block py-2 text-[12px] font-extrabold tracking-[1px] text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    HOME
                  </Link>
                  {/* Show all categories in mobile menu */}
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryClick(cat)}
                      className="block w-full text-left py-2 text-[12px] font-extrabold tracking-[1px] text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all cursor-pointer"
                    >
                      {cat.name.toUpperCase()}
                    </button>
                  ))}
                  <Link
                    href="/about"
                    className="block py-2 text-[12px] font-extrabold tracking-[1px] text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ABOUT
                  </Link>
                  <Link
                    href="/contact"
                    className="block py-2 text-[12px] font-extrabold tracking-[1px] text-[#EED9B9]/80 hover:text-[#D53E0F] transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    CONTACT
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fullscreen Search Overlay */}
      {showSearch && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#5E0006] pt-20">
          <div className="w-full px-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-[#D53E0F]/30">
                <Search className="w-5 h-5 text-[#D53E0F] mr-3 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-[#EED9B9] focus:outline-none text-base placeholder-[#EED9B9]/60 w-full"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="ml-2 p-1 text-[#EED9B9]/70 hover:text-[#EED9B9] rounded-full hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="p-3 bg-white/10 backdrop-blur-sm hover:bg-[#D53E0F] text-[#EED9B9] rounded-lg transition-all duration-300 flex items-center justify-center border border-[#D53E0F]/30"
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
                className="p-3 text-[#EED9B9]/70 hover:text-[#EED9B9] hover:bg-white/10 rounded-lg transition-all duration-300 border border-[#D53E0F]/30"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {(searchResults.length > 0 || isSearching) && (
              <div className="bg-white/10 backdrop-blur-sm border border-[#D53E0F]/30 rounded-lg shadow-2xl max-h-[60vh] overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-[#EED9B9]">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D53E0F] mx-auto"></div>
                    <p className="mt-2 text-sm">Searching...</p>
                  </div>
                ) : (
                  <>
                    <div className="p-2">
                      <p className="text-xs text-[#D53E0F] font-medium px-2 py-1 border-b border-[#D53E0F]/30">Search Results</p>
                      {searchResults.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center p-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
                          onClick={() => handleProductClick(product)}
                        >
                          <div className="w-12 h-12 bg-white/10 rounded-lg flex-shrink-0 overflow-hidden border border-[#D53E0F]/30 relative">
                            {product.image ? (
                              <Image
                                src={getImageUrl(product.image) || ''}
                                className="w-full h-full object-cover"
                                alt={product.name}
                                fill
                                sizes="48px"
                              />
                            ) : (
                              <div className="w-full h-full bg-white/10 flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-[#EED9B9]/70" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#EED9B9] truncate">{product.name}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-[#D53E0F]">{product.category}</p>
                              <p className="text-[#EED9B9] font-medium text-sm">₹{product.basePrice}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      className="border-t border-[#D53E0F]/30 p-3 bg-white/5 hover:bg-white/10 cursor-pointer text-center rounded-b-lg transition-all duration-300"
                      onClick={handleViewAllResults}
                    >
                      <p className="text-sm font-medium text-[#EED9B9] hover:text-[#D53E0F]">
                        View all results for &quot;{searchQuery}&quot;
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#5E0006] border-t border-[#D53E0F]/30 shadow-lg z-40 lg:hidden">
        <div className="w-full px-2">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex flex-col items-center justify-center flex-1 p-1 transition-colors cursor-pointer min-w-0 text-[#EED9B9]/80 hover:text-[#D53E0F]">
              <svg className="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-[10px] font-medium truncate w-full text-center">Home</span>
            </Link>

            <button 
              onClick={handleSearchClick}
              className="flex flex-col items-center justify-center flex-1 p-1 transition-colors cursor-pointer min-w-0 text-[#EED9B9]/80 hover:text-[#D53E0F]"
            >
              <Search className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-medium truncate w-full text-center">Search</span>
            </button>

            <button
              onClick={openCartDrawer}
              className="flex flex-col items-center justify-center flex-1 p-1 transition-colors relative cursor-pointer min-w-0 text-[#EED9B9]/80 hover:text-[#D53E0F]"
            >
              <ShoppingCart className="w-4 h-4 mb-0.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 right-4 bg-[#D53E0F] text-[#EED9B9] rounded-full h-4 w-4 flex items-center justify-center text-[9px] font-bold border border-white/30">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
              <span className="text-[10px] font-medium truncate w-full text-center">Cart</span>
            </button>

            <Link href="/about" className="flex flex-col items-center justify-center flex-1 p-1 transition-colors cursor-pointer min-w-0 text-[#EED9B9]/80 hover:text-[#D53E0F]">
              <svg className="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[10px] font-medium truncate w-full text-center">About</span>
            </Link>

            {isAuthenticated ? (
              <Link href="/profile" className="flex flex-col items-center justify-center flex-1 p-1 transition-colors cursor-pointer min-w-0 text-[#EED9B9]/80 hover:text-[#D53E0F]">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#D53E0F] to-[#9B0F06] flex items-center justify-center text-[9px] font-bold mb-0.5 text-[#EED9B9] border border-white/30">
                  {getUserInitial()}
                </div>
                <span className="text-[10px] font-medium truncate w-full text-center">Account</span>
              </Link>
            ) : (
              <Link href="/login" className="flex flex-col items-center justify-center flex-1 p-1 transition-colors cursor-pointer min-w-0 text-[#EED9B9]/80 hover:text-[#D53E0F]">
                <User className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] font-medium truncate w-full text-center">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartDrawerOpen} onClose={closeCartDrawer} />
    </>
  );
}