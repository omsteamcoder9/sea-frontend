// headerClient.tsx or Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, User } from 'lucide-react';
import { Category } from '@/types/category';
import CartDrawer from '@/components/CartDrawer'; // ✅ ADD THIS

interface HeaderClientProps {
  categories: Category[];
}

export default function HeaderClient({ categories }: HeaderClientProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false); // ✅ ADD THIS
  
  const categoryNames = categories.map(cat => cat.name);
  const cartCount = cart?.totalItems || 0;

  // ✅ Function to open cart drawer
  const openCartDrawer = () => {
    setIsCartDrawerOpen(true);
  };

  // ✅ Function to close cart drawer
  const closeCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Classic India
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {categoryNames.map((cat) => (
                <Link 
                  key={cat} 
                  href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-700 hover:text-orange-600 transition"
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button className="relative">
                <Search className="w-5 h-5 text-gray-600 hover:text-orange-600 transition" />
              </button>
              <button className="relative">
                <Heart className="w-5 h-5 text-gray-600 hover:text-orange-600 transition" />
              </button>
              
              {/* ✅ Cart Button - Opens Drawer instead of navigating */}
              <button 
                onClick={openCartDrawer}  // ✅ CHANGE: from Link to button
                className="relative cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-orange-600 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
              
              {/* Profile / Auth */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-1 hover:text-orange-600 transition cursor-pointer"
                  >
                    <User className="w-5 h-5 text-gray-600 hover:text-orange-600 transition" />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20 border border-gray-100 overflow-hidden">
                        <Link
                          href="/orders"
                          className="block px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            openCartDrawer(); // ✅ Open drawer from dropdown
                          }}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors"
                        >
                          Cart ({cartCount})
                        </button>
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-orange-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg text-white transition bg-gradient-to-r from-orange-500 to-red-600 hover:shadow-lg"
                >
                  Login
                </Link>
              )}

              <button className="md:hidden cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 space-y-2 pb-4">
              {categoryNames.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="block w-full text-left py-2 text-gray-700 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openCartDrawer();
                }}
                className="block w-full text-left py-2 text-gray-700 hover:text-orange-600"
              >
                Cart ({cartCount})
              </button>
            </div>
          )}
        </nav>
      </header>

      {/* ✅ Cart Drawer Component */}
      <CartDrawer 
        isOpen={isCartDrawerOpen} 
        onClose={closeCartDrawer} 
      />
    </>
  );
}