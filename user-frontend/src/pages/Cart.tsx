import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { productService } from '../api/productService';
import { orderService } from '../api/orderService';
import { useToast } from '../context/ToastContext';
import type { ProductRead, CartItemRead } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ChevronLeft,
  Truck,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, updateQuantity, loading: cartLoading, itemCount, refreshCart } = useCart();
  const [products, setProducts] = useState<Record<string, ProductRead>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!cart || cart.items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productIds = cart.items.map((item: CartItemRead) => item.product_id);
        const { data } = await productService.listProducts({ ids: productIds });
        const productMap = data.reduce((acc, p) => {
          acc[p.id] = p;
          return acc;
        }, {} as Record<string, ProductRead>);
        setProducts(productMap);
      } catch (err) {
        console.error("Failed to fetch cart products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCartProducts();
  }, [cart]);

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((acc: number, item: CartItemRead) => {
      const product = products[item.product_id];
      return acc + (product ? product.price * item.quantity : 0);
    }, 0);
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return;
    setUpdatingId(productId);
    try {
      await updateQuantity({ product_id: productId, quantity: newQuantity });
    } catch (err) {
      console.error("Failed to update quantity", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) return;
    
    setIsCheckingOut(true);
    try {
      const orderData = {
        items: cart.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };
      
      const { data: order } = await orderService.createOrder(orderData);
      showToast("Order sequence initialized!", "success");
      
      await refreshCart(true);
      navigate(`/dashboard/orders/${order.id}`, { state: { order } });
    } catch (err: any) {
      console.error("Checkout failed", err);
      showToast(err.response?.data?.detail || "Authorization failed. Attempt restart.", "error");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (loading || cartLoading) return (
    <div className="flex-grow flex items-center justify-center bg-white dark:bg-black">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-shopstack-red border-t-transparent"></div>
    </div>
  );

  const subtotal = calculateSubtotal();
  const deliveryFee = subtotal > 50000 ? 0 : 999;
  const total = subtotal + deliveryFee;

  return (
    <div className="flex-grow bg-white dark:bg-black transition-colors duration-300 pb-24">
      
      {/* Page Header */}
      <div className="shopstack-container py-12">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
          <Link to="/products" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Catalog</Link>
          <ChevronLeft size={12} className="rotate-180" />
          <span>Checkout Queue</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-8">
          <h1 className="text-4xl font-black tracking-tighter uppercase">Shopping Bag</h1>
          <div className="flex items-center gap-3">
            <span className="text-neutral-500 text-xs font-bold uppercase tracking-widest">{itemCount} Units Indexed</span>
            {subtotal > 50000 && (
              <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">Free Express Priority</span>
            )}
          </div>
        </div>
      </div>

      <div className="shopstack-container">
        {!cart || cart.items.length === 0 ? (
          <div className="bg-neutral-50 dark:bg-neutral-950 rounded-3xl p-16 text-center max-w-2xl mx-auto mt-8 border border-neutral-100 dark:border-neutral-900">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white dark:bg-neutral-900 rounded-2xl mb-8 shadow-sm">
              <ShoppingBag size={48} className="text-neutral-200" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">Bag is currently empty</h2>
            <p className="text-neutral-500 text-sm font-medium mb-10 leading-relaxed max-w-xs mx-auto">
              Access the catalog to add items to your bag and begin the checkout process.
            </p>
            <Link to="/products" className="btn-primary !rounded-full !px-10 uppercase tracking-widest text-xs shadow-xl shadow-shopstack-red/20 no-underline">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-8">
              <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
                {cart.items.map((item: CartItemRead) => {
                  const product = products[item.product_id];
                  if (!product) return null;
                  
                  return (
                    <div key={item.id} className="py-10 flex gap-8 md:gap-12 first:pt-0 group">
                      {/* Product Image */}
                      <div className="w-28 h-28 md:w-40 md:h-40 bg-neutral-50 dark:bg-neutral-950 rounded-2xl overflow-hidden flex-shrink-0 p-6 transition-all group-hover:shadow-lg group-hover:shadow-black/5">
                        {product.image_url ? (
                          <img 
                            src={`/api-proxy/product${product.image_url}`} 
                            alt={product.name} 
                            className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Zap size={40} className="text-neutral-200 dark:text-neutral-800" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow flex flex-col md:flex-row md:justify-between gap-6">
                        <div className="space-y-2 max-w-md">
                          <div className="flex items-center gap-3">
                            <p className="text-[10px] font-black uppercase text-shopstack-red tracking-widest">
                              {product.category}
                            </p>
                            <div className="h-1 w-1 bg-neutral-300 rounded-full" />
                            <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">
                              ID: {product.id.substring(0,8)}
                            </p>
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-shopstack-red transition-colors">
                            <Link to={`/products/${product.id}`} className="no-underline text-inherit">
                              {product.name}
                            </Link>
                          </h3>
                          <p className="text-xs text-neutral-500 font-medium leading-relaxed line-clamp-2">
                            {product.description || "Premium ShopStack certified product. Engineered for quality and performance."}
                          </p>
                          
                          <div className="flex items-center gap-8 mt-8">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-neutral-50 dark:bg-neutral-950 rounded-lg p-1 border border-neutral-100 dark:border-neutral-900">
                              <button 
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                disabled={updatingId !== null || item.quantity <= 1}
                                className="w-8 h-8 rounded-md hover:bg-white dark:hover:bg-neutral-900 hover:shadow-sm flex items-center justify-center transition-all disabled:opacity-30 border-none bg-transparent cursor-pointer text-shopstack-black dark:text-white"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-10 text-center text-xs font-black text-shopstack-black dark:text-white">
                                {updatingId === item.product_id ? '...' : item.quantity}
                              </span>
                              <button 
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                disabled={updatingId !== null}
                                className="w-8 h-8 rounded-md hover:bg-white dark:hover:bg-neutral-900 hover:shadow-sm flex items-center justify-center transition-all disabled:opacity-30 border-none bg-transparent cursor-pointer text-shopstack-black dark:text-white"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => handleUpdateQuantity(item.product_id, 0)}
                              className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors flex items-center gap-2 bg-transparent border-none cursor-pointer"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Price Column */}
                        <div className="text-right flex md:flex-col justify-between items-center md:items-end min-w-[120px]">
                           <div className="md:hidden text-[10px] font-black uppercase text-neutral-400 tracking-widest">Subtotal</div>
                           <div className="price-tag !text-2xl !mt-0 text-shopstack-black dark:text-white">
                             <span className="price-currency">Rs.</span>
                             <span>{(product.price * item.quantity).toLocaleString()}</span>
                           </div>
                           <div className="hidden md:block text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-2">
                             {product.price.toLocaleString()} / Unit
                           </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-4 bg-neutral-50 dark:bg-neutral-950 p-10 rounded-3xl sticky top-32 space-y-10 border border-neutral-100 dark:border-neutral-900 shadow-sm">
              <h2 className="text-2xl font-black uppercase tracking-tighter">Order Intelligence</h2>
              
              <div className="space-y-5">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-neutral-500">Gross Total</span>
                  <span className="text-shopstack-black dark:text-white font-black">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-neutral-500">Logistics Fee</span>
                  <span className={`font-black ${deliveryFee === 0 ? 'text-emerald-500' : 'text-shopstack-black dark:text-white'}`}>
                    {deliveryFee === 0 ? 'SUBSIDIZED' : `Rs. ${deliveryFee.toLocaleString()}`}
                  </span>
                </div>
                
                {deliveryFee > 0 && (
                  <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl flex gap-4 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <Truck size={20} className="text-shopstack-red flex-shrink-0" />
                    <p className="text-[11px] font-bold leading-relaxed uppercase tracking-tight">
                      Increase order value by Rs. {(50000 - subtotal).toLocaleString()} to unlock <span className="text-shopstack-red">priority free logistics</span>.
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between items-center mb-10">
                  <span className="text-sm font-black uppercase tracking-widest">Final Amount</span>
                  <div className="price-tag !text-3xl !mt-0 text-shopstack-black dark:text-white">
                    <span className="price-currency">Rs.</span>
                    <span>{total.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="btn-primary !w-full !py-5 !rounded-xl flex justify-between items-center px-10 shadow-2xl shadow-shopstack-red/30 group uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Authorizing...
                    </span>
                  ) : (
                    <>
                      <span>Authorize Checkout</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4 p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                  <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0" />
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-tight leading-relaxed">
                    Secure Transaction Protocol Active. 365-day satisfaction guarantee included.
                  </p>
                </div>
                
                <div className="flex justify-center items-center gap-6 opacity-30 grayscale dark:invert brightness-0 dark:brightness-200">
                  <div className="w-10 h-6 bg-neutral-400 rounded-sm"></div>
                  <div className="w-10 h-6 bg-neutral-400 rounded-sm"></div>
                  <div className="w-10 h-6 bg-neutral-400 rounded-sm"></div>
                  <div className="w-10 h-6 bg-neutral-400 rounded-sm"></div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
