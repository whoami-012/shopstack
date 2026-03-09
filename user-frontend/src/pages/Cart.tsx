import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { productService } from '../api/productService';
import type { ProductRead } from '../types';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

const Cart: React.FC = () => {
  const { cart, updateQuantity, loading: cartLoading, isUpdating, itemCount } = useCart();
  const [products, setProducts] = useState<Record<string, ProductRead>>({});
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartProducts = async () => {
      if (!cart || cart.items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productIds = cart.items.map(item => item.product_id);
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
    return cart.items.reduce((acc, item) => {
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

  if (loading || cartLoading) return (
    <div className="flex-grow flex items-center justify-center bg-page-bg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-shopstack-red"></div>
    </div>
  );

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="flex-grow bg-page-bg transition-colors duration-500 pb-24">
      
      {/* Page Header */}
      <div className="bg-shopstack-gray dark:bg-[#1a1a1a] py-16 mb-16 text-center transition-colors">
        <h1 className="text-4xl font-black text-page-heading uppercase tracking-tighter mb-4">Your Shopping Cart</h1>
        <div className="flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <Link to="/products" className="hover:text-shopstack-red transition-colors text-inherit no-underline">Home</Link>
          <span>/</span>
          <span className="text-shopstack-red">Cart</span>
        </div>
      </div>

      <div className="shopstack-container">
        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-shopstack-border rounded-sm">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-shopstack-gray dark:bg-[#1a1a1a] text-gray-400 rounded-full mb-6">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-3xl font-black text-page-heading mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-10 max-w-md mx-auto font-medium">Looks like you haven't added anything to your cart yet. Browse our products and find something you love!</p>
            <Link to="/products" className="shopstack-button no-underline inline-flex items-center gap-2">
              <ChevronLeft size={20} /> Back to Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-16 items-start">
            
            {/* Cart Items List */}
            <div className="xl:col-span-2 space-y-8">
              <div className="hidden md:grid grid-cols-6 pb-6 border-b border-shopstack-border dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-400">
                <div className="col-span-3">Product</div>
                <div className="text-center">Price</div>
                <div className="text-center">Quantity</div>
                <div className="text-right">Total</div>
              </div>

              <div className="divide-y divide-shopstack-border dark:divide-gray-800">
                {cart.items.map((item) => {
                  const product = products[item.product_id];
                  if (!product) return null;
                  
                  return (
                    <div key={item.id} className="py-6 sm:py-8 flex flex-col md:grid md:grid-cols-6 gap-4 sm:gap-6 items-start md:items-center">
                      {/* Product Info */}
                      <div className="md:col-span-3 flex items-start sm:items-center gap-4 sm:gap-6 w-full">
                        <div className="w-20 h-28 sm:w-24 sm:h-32 bg-shopstack-gray dark:bg-[#1a1a1a] rounded-sm overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <img src={`/api-proxy/product${product.image_url.startsWith('/') ? '' : '/'}${product.image_url}`} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400 uppercase">{product.name.substring(0, 2)}</div>
                          )}
                        </div>
                        <div className="space-y-1 flex-grow">
                          <p className="text-[10px] font-black uppercase text-shopstack-red tracking-widest">{product.category}</p>
                          <h3 className="text-base sm:text-lg font-black text-page-heading line-clamp-2 sm:line-clamp-none">
                            <Link to={`/products/${product.id}`} className="hover:text-shopstack-red transition-colors no-underline text-inherit">
                              {item.name || product.name}
                            </Link>
                          </h3>
                          <button 
                            onClick={() => handleUpdateQuantity(item.product_id, 0)}
                            className="text-xs font-bold text-gray-400 hover:text-shopstack-red flex items-center gap-1 mt-2 sm:mt-3 bg-transparent border-none cursor-pointer p-0"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Mobile controls container */}
                      <div className="flex flex-wrap items-center justify-between w-full md:contents pt-4 border-t border-shopstack-border dark:border-gray-800 md:pt-0 md:border-none">
                        {/* Price */}
                        <div className="text-left md:text-center w-1/2 md:w-auto mb-4 md:mb-0">
                          <span className="block md:hidden text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Price</span>
                          <span className="text-base sm:text-lg font-black text-page-heading">${product.price.toFixed(2)}</span>
                        </div>

                        {/* Quantity */}
                        <div className="flex justify-end md:justify-center w-1/2 md:w-auto mb-4 md:mb-0">
                          <div className="flex flex-col items-end md:items-center">
                            <span className="block md:hidden text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Quantity</span>
                            <div className={`inline-flex items-center border border-shopstack-border dark:border-gray-700 rounded-sm transition-all duration-200 h-9 sm:h-auto ${updatingId === item.product_id ? 'opacity-40 scale-95' : 'opacity-100 scale-100'}`}>
                              <button 
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                                disabled={updatingId !== null}
                                className="p-2 sm:p-2 hover:bg-shopstack-gray dark:hover:bg-[#222] transition-colors border-none bg-transparent text-page-text disabled:cursor-not-allowed"
                              >
                                <Minus size={14} />
                              </button>
                              <div className="px-3 sm:px-4 py-1 sm:py-2 min-w-[32px] sm:min-w-[40px] flex items-center justify-center">
                                {updatingId === item.product_id ? (
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-shopstack-red border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <span className="font-black text-sm sm:text-base text-page-heading">{item.quantity}</span>
                                )}
                              </div>
                              <button 
                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                                disabled={updatingId !== null}
                                className="p-2 sm:p-2 hover:bg-shopstack-gray dark:hover:bg-[#222] transition-colors border-none bg-transparent text-page-text disabled:cursor-not-allowed"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="text-right w-full md:w-auto pt-4 md:pt-0 border-t border-shopstack-border dark:border-gray-800 md:border-none flex justify-between items-center md:block">
                          <span className="text-page-text font-bold md:hidden text-sm uppercase tracking-widest">Total:</span>
                          <span className="text-lg sm:text-xl font-black text-shopstack-red">${(product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-8 flex flex-wrap justify-between gap-6">
                <Link to="/products" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-page-heading hover:text-shopstack-red transition-colors no-underline">
                  <ChevronLeft size={18} /> Continue Shopping
                </Link>
                <button 
                  onClick={() => {/* Clear cart if needed */}}
                  className="text-sm font-black uppercase tracking-widest text-gray-400 hover:text-shopstack-red transition-colors bg-transparent border-none cursor-pointer"
                >
                  Clear Shopping Cart
                </button>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="bg-shopstack-gray dark:bg-[#1a1a1a] p-8 lg:p-10 rounded-sm sticky top-32 transition-colors">
              <h3 className="text-xl font-black text-page-heading uppercase tracking-tighter mb-8 pb-4 border-b border-shopstack-border dark:border-gray-800">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-500 uppercase tracking-widest">Subtotal ({itemCount} items)</span>
                  <span className="text-page-heading">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-gray-500 uppercase tracking-widest">Shipping</span>
                  <span className="text-page-heading">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-shopstack-red font-black uppercase tracking-widest">
                    Add ${(200 - subtotal).toFixed(2)} more for FREE shipping!
                  </p>
                )}
              </div>

              <div className="pt-6 border-t border-shopstack-border dark:border-gray-800 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-black text-page-heading uppercase tracking-tighter">Total</span>
                  <span className="text-3xl font-black text-shopstack-red">${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full shopstack-button !py-5 flex justify-center items-center gap-3 shadow-2xl shadow-shopstack-red/20 group">
                Proceed To Checkout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="mt-8 space-y-4">
                <p className="text-[10px] font-bold text-gray-500 text-center uppercase tracking-widest">Accepted Payments</p>
                <div className="flex justify-center gap-4 grayscale opacity-50">
                  <div className="w-10 h-6 bg-gray-300 rounded-sm"></div>
                  <div className="w-10 h-6 bg-gray-300 rounded-sm"></div>
                  <div className="w-10 h-6 bg-gray-300 rounded-sm"></div>
                  <div className="w-10 h-6 bg-gray-300 rounded-sm"></div>
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
