// app/profile/page.tsx - COMPLETE CORRECTED VERSION
'use client';

import { useState, useEffect } from 'react';
import { getUserOrders } from '@/lib/order-api';
import { Order, OrderItem } from '@/types/order';
import { useRouter } from 'next/navigation';

// Cancel order function for profile page
interface CancelOrderRequest {
  cancellationReason?: string;
}

const cancelOrder = async (orderId: string, token: string, cancellationReason?: string): Promise<Order> => {
  try {
    const cancelData: CancelOrderRequest = {};
    if (cancellationReason) {
      cancelData.cancellationReason = cancellationReason;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancelData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to cancel order: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

// ✅ ADDED: Helper function to calculate order total
const calculateOrderTotal = (order: Order): number => {
  // First try finalAmount (most accurate)
  if (order.finalAmount && order.finalAmount > 0) {
    return order.finalAmount;
  }
  
  // Then try totalAmount
  if (order.totalAmount && order.totalAmount > 0) {
    return order.totalAmount;
  }
  
  // Calculate from products if available
  if (order.products && order.products.length > 0) {
    return order.products.reduce((total, item) => {
      // Use item.price (actual price paid) if available
      const itemPrice = item.price || item.product?.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
  }
  
  return 0;
};

// ✅ ADDED: Helper function to calculate subtotal from products
const calculateSubtotal = (products: OrderItem[]): number => {
  if (!products || products.length === 0) return 0;
  
  return products.reduce((total, item) => {
    const itemPrice = item.price || item.product?.price || 0;
    return total + (itemPrice * item.quantity);
  }, 0);
};

// ✅ ADDED: Helper function to get product display name with variant
const getProductDisplayName = (item: OrderItem): string => {
  // First try item.name (contains product + variant for guest orders)
  if (item.name) {
    return item.name;
  }
  
  // Then try product.name + variantName
  const productName = item.product?.name || 'Product';
  if (item.variantName) {
    return `${productName} - ${item.variantName}`;
  }
  
  return productName;
};

export default function UserProfile() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [cancelledOrders, setCancelledOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelledOrdersModal, setShowCancelledOrdersModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [pdfLoading, setPdfLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('Please log in to view your orders');
          setLoading(false);
          return;
        }

        console.log('🔄 Fetching user orders...');
        const userOrders = await getUserOrders(token);
        
        console.log('📦 Orders fetched:', userOrders);
        
        // Log order details for debugging
        userOrders.forEach((order, index) => {
          console.log(`Order ${index + 1}:`, {
            orderId: order.orderId,
            isGuestOrder: order.isGuestOrder,
            totalAmount: order.totalAmount,
            finalAmount: order.finalAmount,
            subtotal: order.subtotal,
            productsCount: order.products?.length,
            products: order.products?.map(p => ({
              name: p.name,
              productName: p.product?.name,
              variantName: p.variantName,
              price: p.price,
              quantity: p.quantity,
              itemTotal: (p.price || 0) * p.quantity
            }))
          });
        });
        
        setOrders(userOrders);
        
        // Separate active and cancelled orders
        const nonCancelledOrders = userOrders.filter(order => order.orderStatus !== 'cancelled');
        const cancelledOrdersList = userOrders.filter(order => order.orderStatus === 'cancelled');
        
        setActiveOrders(nonCancelledOrders);
        setCancelledOrders(cancelledOrdersList);
        
      } catch (err: unknown) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view order details');
        return;
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load order: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.order) {
        setSelectedOrder(data.order);
      } else {
        throw new Error('Order data not found in response');
      }
      
    } catch (err: unknown) {
      console.error('Error fetching order details:', err);
      setError(`Failed to load order details: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleCancelOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!selectedOrder) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to cancel order');
        return;
      }

      setCancellingOrderId(selectedOrder._id);
      await cancelOrder(selectedOrder._id, token, cancellationReason);
      
      // Update the orders state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === selectedOrder._id 
            ? { ...order, orderStatus: 'cancelled' }
            : order
        )
      );
      
      // Move from active to cancelled
      setActiveOrders(prevOrders => 
        prevOrders.filter(order => order._id !== selectedOrder._id)
      );
      
      setCancelledOrders(prevOrders => [
        { ...selectedOrder, orderStatus: 'cancelled' },
        ...prevOrders
      ]);
      
      // Close modal and reset state
      setShowCancelModal(false);
      setSelectedOrder(null);
      setCancellationReason('');
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
      console.error('Error cancelling order:', err);
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleViewPDF = async (orderId: string) => {
    try {
      setPdfLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view receipt');
        setPdfLoading(false);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const pdfEndpoint = `${apiUrl}/orders/${orderId}/receipt/pdf`;
      
      const response = await fetch(pdfEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch PDF');
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      setPdfUrl(blobUrl);
      setShowPDFModal(true);
      
    } catch (err: unknown) {
      console.error('Error opening PDF:', err);
      setError('Failed to load PDF. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const closePDFModal = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
    }
    setShowPDFModal(false);
    setPdfUrl('');
  };

  const canCancelOrder = (order: Order): boolean => {
    const cancellableStatuses = ['pending', 'confirmed', 'processing'];
    return cancellableStatuses.includes(order.orderStatus);
  };

  const getStatusBadge = (status: string, type: 'order' | 'payment') => {
    const statusColors = {
      order: {
        pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
        processing: 'bg-purple-100 text-purple-800 border border-purple-200',
        shipped: 'bg-purple-100 text-purple-800 border border-purple-200',
        delivered: 'bg-gradient-to-r from-[#D97A22]/10 to-[#D97A22]/10 text-[#D97A22] border border-[#D97A22]/20',
        cancelled: 'bg-red-100 text-red-800 border border-red-200'
      },
      payment: {
        pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        completed: 'bg-gradient-to-r from-[#D97A22]/10 to-[#D97A22]/10 text-[#D97A22] border border-[#D97A22]/20',
        failed: 'bg-red-100 text-red-800 border border-red-200'
      }
    };

    const typeColors = type === 'order' ? statusColors.order : statusColors.payment;
    const colorClass = typeColors[status as keyof typeof typeColors] || 'bg-gray-100 text-gray-800 border border-gray-200';
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ ADDED: Get item total for display
  const getItemTotal = (item: OrderItem): number => {
    const price = item.price || item.product?.price || 0;
    return price * item.quantity;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D97A22] mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-300">
            <div className="text-red-600 mb-4 font-medium">{error}</div>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-[#D97A22] to-[#D97A22] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 font-medium cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account and orders</p>
        </div>

        {activeOrders.length === 0 && cancelledOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-300">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-[#D97A22]/10 to-[#D97A22]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D97A22]/20">
                <svg className="w-10 h-10 text-[#D97A22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
              <button
                onClick={() => router.push('/products')}
                className="bg-gradient-to-r from-[#D97A22] to-[#D97A22] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all duration-200 font-medium cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Profile Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="sticky top-6 space-y-6">
                {/* Profile Summary Card */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Orders</span>
                      <span className="font-semibold text-gray-900">{activeOrders.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cancelled Orders</span>
                      <span className="font-semibold text-gray-900">{cancelledOrders.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Orders</span>
                      <span className="font-semibold text-gray-900">{orders.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Spent</span>
                      <span className="font-semibold text-gray-900">
                        ₹{orders.reduce((total, order) => total + calculateOrderTotal(order), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6 border border-gray-300">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {cancelledOrders.length > 0 && (
                      <button
                        onClick={() => setShowCancelledOrdersModal(true)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-[#D97A22]/10 to-[#D97A22]/10 text-[#D97A22] rounded-lg hover:bg-gradient-to-r hover:from-[#D97A22]/20 hover:to-[#D97A22]/20 font-medium transition-colors text-left flex items-center gap-3 border border-[#D97A22]/20 cursor-pointer"
                      >
                        <svg className="w-5 h-5 text-[#D97A22]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        View Cancelled Orders ({cancelledOrders.length})
                      </button>
                    )}
                    <button
                      onClick={() => router.push('/products')}
                      className="w-full px-4 py-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors text-left flex items-center gap-3 border border-gray-300 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Active Orders */}
            <div className="lg:col-span-3">
              {/* Active Orders Card */}
              <div className="bg-white rounded-lg shadow-md border border-gray-300 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-300 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Active Orders</h2>
                      <p className="text-gray-600 mt-1 text-sm">
                        {activeOrders.length} {activeOrders.length === 1 ? 'active order' : 'active orders'}
                      </p>
                    </div>
                    {cancelledOrders.length > 0 && (
                      <button
                        onClick={() => setShowCancelledOrdersModal(true)}
                        className="text-[#D97A22] hover:text-[#D97A22]/80 font-medium text-sm flex items-center gap-2 cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        View Cancelled ({cancelledOrders.length})
                      </button>
                    )}
                  </div>
                </div>
                
                {activeOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No active orders</h3>
                    <p className="text-gray-600 mb-4">All your current orders are completed or cancelled</p>
                    <button
                      onClick={() => router.push('/products')}
                      className="bg-gradient-to-r from-[#D97A22] to-[#D97A22] text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all duration-200 font-medium cursor-pointer"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {activeOrders.map((order) => {
                      // ✅ FIXED: Calculate order total properly
                      const orderTotal = calculateOrderTotal(order);
                      const subtotal = calculateSubtotal(order.products || []);
                      
                      return (
                        <div
                          key={order._id}
                          className={`p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200 group ${
                            selectedOrder?._id === order._id ? 'bg-gray-100 border-l-4 border-l-[#D97A22]' : ''
                          }`}
                          onClick={() => fetchOrderDetails(order._id)}
                        >
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-3">
                                <h3 className={`text-lg font-semibold group-hover:text-gray-700 transition-colors ${
                                  selectedOrder?._id === order._id ? 'text-gray-800' : 'text-gray-900'
                                }`}>
                                  Order #{order.orderId || order._id?.slice(-8)}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {getStatusBadge(order.orderStatus, 'order')}
                                  {getStatusBadge(order.paymentStatus, 'payment')}
                                </div>
                              </div>
                              
                              <p className="text-gray-600 mb-3 text-sm">
                                Placed on {formatDate(order.createdAt)}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="text-gray-600">{order.products?.length || 0} items</span>
                                <span className="text-gray-400">•</span>
                                {/* ✅ FIXED: Show correct price */}
                                <span className="font-semibold text-gray-900">
                                  ₹{orderTotal.toFixed(2)}
                                </span>
                                {orderTotal > 0 && subtotal > 0 && orderTotal !== subtotal && (
                                  <>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-500 line-through text-xs">
                                      ₹{subtotal.toFixed(2)}
                                    </span>
                                  </>
                                )}
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600 capitalize">{order.paymentMethod}</span>
                              </div>

                              {/* Order Items Preview */}
                              <div className="mt-4 flex flex-wrap gap-3">
                                {order.products?.slice(0, 3).map((item, index) => {
                                  const itemTotal = getItemTotal(item);
                                  
                                  return (
                                    <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-300">
                                      {/* ✅ FIX 1: Use getProductDisplayName helper */}
                                      <span className="text-sm text-gray-700">
                                        {getProductDisplayName(item)}
                                      </span>
                                      
                                      {item.selectedSize && (
                                        <span className="text-xs bg-gradient-to-r from-[#D97A22]/10 to-[#D97A22]/10 text-[#D97A22] px-2 py-1 rounded-full font-medium">
                                          Size: {item.selectedSize}
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-500 bg-white px-1 rounded border">
                                        x{item.quantity}
                                      </span>
                                      <span className="text-xs font-semibold text-gray-900">
                                        ₹{itemTotal.toFixed(2)}
                                      </span>
                                    </div>
                                  );
                                })}
                                {order.products && order.products.length > 3 && (
                                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-300">
                                    <span className="text-sm text-gray-700">
                                      +{order.products.length - 3} more
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 lg:items-end">
                              {/* Cancel Button */}
                              {canCancelOrder(order) && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCancelOrder(order);
                                  }}
                                  disabled={cancellingOrderId === order._id}
                                  className="border border-red-600 text-red-600 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                  {cancellingOrderId === order._id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                      Cancelling...
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                      Cancel Order
                                    </>
                                  )}
                                </button>
                              )}
                              
                              {/* View PDF Button */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPDF(order._id);
                                }}
                                disabled={pdfLoading}
                                className="border border-[#D97A22] text-[#D97A22] px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-[#D97A22] hover:to-[#D97A22] hover:text-white transition-colors font-medium text-sm flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                              >
                                {pdfLoading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#D97A22]"></div>
                                    Loading...
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                    </svg>
                                    View PDF
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Confirmation Modal */}
        {showCancelModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancel Order #{selectedOrder.orderId || selectedOrder._id?.slice(-8)}
              </h3>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this order? This action cannot be undone.
              </p>

              <div className="mb-4">
                <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  id="cancellationReason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="Please provide a reason for cancellation..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D97A22] focus:border-[#D97A22] transition-all duration-200"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedOrder(null);
                    setCancellationReason('');
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  disabled={cancellingOrderId !== null}
                >
                  Keep Order
                </button>
                <button
                  onClick={confirmCancelOrder}
                  disabled={cancellingOrderId !== null}
                  className="px-4 py-2 bg-gradient-to-r from-[#D97A22] to-[#D97A22] text-white rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                >
                  {cancellingOrderId ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PDF Modal */}
        {showPDFModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-300">
              <div className="px-6 py-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Order Receipt</h3>
                <div className="flex items-center gap-3">
                  {/* Download Button */}
                  <a
                    href={pdfUrl}
                    download={`receipt-${selectedOrder?.orderId || selectedOrder?._id?.slice(-8)}.pdf`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D97A22] to-[#D97A22] text-white rounded-lg hover:opacity-90 transition-colors font-medium text-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                  <button
                    onClick={closePDFModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg cursor-pointer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                {pdfLoading ? (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D97A22] mx-auto"></div>
                      <p className="mt-4 text-gray-600">Loading PDF...</p>
                    </div>
                  </div>
                ) : pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    className="w-full h-full min-h-[500px]"
                    title="Order Receipt"
                  />
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load PDF</h3>
                      <p className="text-gray-600">The receipt could not be loaded. Please try again.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Cancelled Orders Modal */}
        {showCancelledOrdersModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-300">
              <div className="px-6 py-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Cancelled Orders ({cancelledOrders.length})
                </h3>
                <button
                  onClick={() => setShowCancelledOrdersModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {cancelledOrders.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No cancelled orders</h3>
                    <p className="text-gray-600">You haven&apos;t cancelled any orders yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {cancelledOrders.map((order) => {
                      const orderTotal = calculateOrderTotal(order);
                      
                      return (
                        <div
                          key={order._id}
                          className="p-6 hover:bg-gray-50 cursor-pointer transition-all duration-200"
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowCancelledOrdersModal(false);
                          }}
                        >
                          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Order #{order.orderId || order._id?.slice(-8)}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                  {getStatusBadge(order.orderStatus, 'order')}
                                  {getStatusBadge(order.paymentStatus, 'payment')}
                                </div>
                              </div>
                              
                              <p className="text-gray-600 mb-3 text-sm">
                                Cancelled on {formatDate(order.updatedAt || order.createdAt)}
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="text-gray-600">{order.products?.length || 0} items</span>
                                <span className="text-gray-400">•</span>
                                <span className="font-semibold text-gray-900">
                                  ₹{orderTotal.toFixed(2)}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-600 capitalize">{order.paymentMethod}</span>
                                <span className="text-gray-400">•</span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewPDF(order._id);
                                  }}
                                  className="inline-flex items-center gap-1 text-[#D97A22] hover:text-[#D97A22]/80 font-medium text-sm cursor-pointer"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                  </svg>
                                  View PDF
                                </button>
                              </div>

                              {/* Order Items Preview */}
                              <div className="mt-4 flex flex-wrap gap-3">
                                {order.products?.slice(0, 3).map((item, index) => {
                                  const itemTotal = getItemTotal(item);
                                  
                                  return (
                                    <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-300">
                                      {/* ✅ FIX 2: Use getProductDisplayName in cancelled orders too */}
                                      <span className="text-sm text-gray-700">
                                        {getProductDisplayName(item)}
                                      </span>
                                      {item.selectedSize && (
                                        <span className="text-xs bg-gradient-to-r from-[#D97A22]/10 to-[#D97A22]/10 text-[#D97A22] px-2 py-1 rounded-full font-medium">
                                          Size: {item.selectedSize}
                                        </span>
                                      )}
                                      <span className="text-xs text-gray-500 bg-white px-1 rounded border">
                                        x{item.quantity}
                                      </span>
                                      <span className="text-xs font-semibold text-gray-900">
                                        ₹{itemTotal.toFixed(2)}
                                      </span>
                                    </div>
                                  );
                                })}
                                {order.products && order.products.length > 3 && (
                                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-300">
                                    <span className="text-sm text-gray-700">
                                      +{order.products.length - 3} more
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}