import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../api/productService';
import type { ProductRead } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  Star,
  Edit,
  ChevronRight,
  Layers
} from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data } = await productService.getProduct(productId);
      setProduct(data);
    } catch (err) {
      console.error("Failed to fetch product", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart({
        product_id: product.id,
        quantity: quantity
      });
      showToast(`${product.name} added to bag.`, 'success');
    } catch (err) {
      console.error("Failed to add to cart", err);
      showToast("Authorization failed. Try again.", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-shopstack-red border-t-transparent"></div>
    </div>
  );

  if (!product) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black gap-6">
      <Layers size={48} className="text-neutral-200" />
      <h2 className="text-2xl font-black uppercase tracking-tighter">Item Not Found</h2>
      <Link to="/products" className="btn-primary !rounded-full no-underline uppercase tracking-widest text-[10px] px-10">Return to Catalog</Link>
    </div>
  );

  return (
    <div className="flex-grow bg-white dark:bg-black transition-colors duration-300 pb-24">
      
      {/* Breadcrumb & Title */}
      <div className="shopstack-container py-12">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-8">
          <Link to="/products" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Catalog</Link>
          <ChevronRight size={12} />
          <span>{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-shopstack-red">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Media */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-neutral-50 dark:bg-neutral-950 rounded-3xl overflow-hidden aspect-square relative group border border-neutral-100 dark:border-neutral-900 p-12">
              {product.image_url ? (
                <img 
                  src={`/api-proxy/product${product.image_url.startsWith('/') ? '' : '/'}${product.image_url}`} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-1000 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Layers size={80} className="text-neutral-200 dark:text-neutral-800" />
                </div>
              )}
              
              <div className="absolute top-8 left-8 flex flex-col gap-2">
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-amber-500/20">Critical Stock</span>
                )}
                <span className="bg-shopstack-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">SKU: {product.id.substring(0,8)}</span>
              </div>
            </div>
          </div>

          {/* Right: Intelligence & Checkout */}
          <div className="lg:col-span-5 space-y-10 sticky top-32">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-shopstack-red text-[10px] font-black uppercase tracking-[0.2em]">
                  {product.category}
                </span>
                <div className="h-1 w-1 bg-neutral-300 rounded-full" />
                <div className="flex items-center text-amber-400">
                  <Star size={12} fill="currentColor" />
                  <span className="text-neutral-400 text-[10px] ml-2 font-black uppercase tracking-widest">4.8 Rating</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-black text-shopstack-black dark:text-white tracking-tighter uppercase leading-none">{product.name}</h1>
              
              <div className="price-tag !text-4xl text-shopstack-black dark:text-white pt-4">
                <span className="price-currency">Rs.</span>
                <span>{product.price.toLocaleString()}</span>
              </div>
            </div>

            <p className="text-neutral-500 leading-relaxed text-sm font-medium">
              {product.description || "Premium ShopStack certified product. Engineered for quality and performance. Verified authentic by Nexus Protocol."}
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center bg-neutral-50 dark:bg-neutral-950 rounded-xl p-1 border border-neutral-100 dark:border-neutral-900">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-lg hover:bg-white dark:hover:bg-neutral-900 hover:shadow-sm flex items-center justify-center transition-all border-none bg-transparent text-shopstack-black dark:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center text-sm font-black text-shopstack-black dark:text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-lg hover:bg-white dark:hover:bg-neutral-900 hover:shadow-sm flex items-center justify-center transition-all border-none bg-transparent text-shopstack-black dark:text-white font-bold"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stock === 0}
                  className="flex-grow btn-primary !py-4 !rounded-xl flex justify-center items-center gap-3 shadow-2xl shadow-shopstack-red/20 active:scale-[0.98] transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                >
                  <ShoppingCart size={18} /> {addingToCart ? 'Syncing...' : 'Add To Bag'}
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button className="flex-1 border border-neutral-100 dark:border-neutral-900 py-4 flex justify-center items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all font-black text-[10px] uppercase tracking-widest rounded-xl bg-transparent text-neutral-500">
                  <Heart size={16} /> Wishlist
                </button>
                <button className="flex-1 border border-neutral-100 dark:border-neutral-900 py-4 flex justify-center items-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all font-black text-[10px] uppercase tracking-widest rounded-xl bg-transparent text-neutral-500">
                  <Share2 size={16} /> Share
                </button>
              </div>
            </div>

            {/* Logistics Info */}
            <div className="grid grid-cols-2 gap-4 pt-10">
              <div className="p-5 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-900 group transition-colors hover:border-shopstack-red/30">
                <Truck size={20} className="text-shopstack-red mb-4" />
                <h4 className="text-[10px] font-black text-shopstack-black dark:text-white uppercase tracking-widest mb-1">Express Delivery</h4>
                <p className="text-[9px] text-neutral-500 font-bold uppercase">2-3 Business Days</p>
              </div>
              <div className="p-5 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-900 group transition-colors hover:border-shopstack-red/30">
                <ShieldCheck size={20} className="text-emerald-500 mb-4" />
                <h4 className="text-[10px] font-black text-shopstack-black dark:text-white uppercase tracking-widest mb-1">Nexus Verified</h4>
                <p className="text-[9px] text-neutral-500 font-bold uppercase">Genuine Guaranteed</p>
              </div>
            </div>

            <div className="pt-6 flex flex-col gap-3">
              <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl">
                <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Inventory Status</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-emerald-500' : 'text-shopstack-red'}`}>
                  {product.stock > 0 ? `${product.stock} Units Indexed` : 'Inventory Depleted'}
                </span>
              </div>
              {user && (user.role === 'admin' || user.role === 'seller') && (
                <Link 
                  to={`/products/edit/${product.id}`}
                  className="flex items-center justify-center gap-2 p-4 bg-shopstack-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-shopstack-red transition-all no-underline"
                >
                  <Edit size={14} /> Update Parameters
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
