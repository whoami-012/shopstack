import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../api/productService';
import type { ProductRead } from '../types';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star
} from 'lucide-react';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-page-bg">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-flone-red"></div>
    </div>
  );

  if (!product) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-page-bg gap-6">
      <h2 className="text-3xl font-bold text-page-heading">Product Not Found</h2>
      <Link to="/products" className="flone-button no-underline">Back to Shop</Link>
    </div>
  );

  return (
    <div className="flex-grow bg-page-bg transition-colors duration-500 pb-20">
      
      {/* Breadcrumb */}
      <div className="bg-flone-gray dark:bg-[#1a1a1a] py-12 mb-16 text-center transition-colors">
        <h1 className="text-3xl font-black text-page-heading uppercase tracking-tighter mb-2">{product.name}</h1>
        <div className="flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-500">
          <Link to="/products" className="hover:text-flone-red transition-colors text-inherit no-underline">Home</Link>
          <span>/</span>
          <span className="text-flone-red">Product Details</span>
        </div>
      </div>

      <div className="flone-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Product Image Section */}
          <div className="space-y-6">
            <div className="bg-flone-gray dark:bg-[#1a1a1a] rounded-sm overflow-hidden aspect-[4/5] relative group transition-colors">
              {product.image_url ? (
                <img 
                  src={`/api-proxy/product${product.image_url}`} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                  <span className="font-black text-9xl opacity-10 uppercase">{product.name.substring(0, 2)}</span>
                </div>
              )}
              
              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute top-6 left-6 bg-flone-red text-white text-xs font-black uppercase px-4 py-1.5 shadow-lg">
                  Low Stock
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />)}
                  <span className="text-gray-400 text-xs ml-2 font-bold">(12 Reviews)</span>
                </div>
              </div>
              
              <h2 className="text-4xl font-black text-page-heading tracking-tight">{product.name}</h2>
              
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black text-flone-red">${product.price.toFixed(2)}</span>
                <span className="text-xl text-gray-400 line-through font-bold">${(product.price * 1.2).toFixed(2)}</span>
              </div>
            </div>

            <div className="h-px bg-flone-border dark:bg-gray-800 w-full"></div>

            <p className="text-page-text leading-relaxed text-base font-medium opacity-80">
              {product.description}
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center border border-flone-border dark:border-gray-700 rounded-sm overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-flone-gray dark:hover:bg-[#222] transition-colors border-none bg-transparent text-page-text font-bold"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 font-black text-page-heading w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-flone-gray dark:hover:bg-[#222] transition-colors border-none bg-transparent text-page-text font-bold"
                  >
                    +
                  </button>
                </div>
                
                <button className="flex-grow flone-button !py-4 flex justify-center items-center gap-3 shadow-xl shadow-flone-red/10 active:scale-[0.98] transition-transform">
                  <ShoppingCart size={20} /> Add To Cart
                </button>
              </div>

              <div className="flex items-center gap-4">
                <button className="flex-1 border border-flone-border dark:border-gray-700 py-3 flex justify-center items-center gap-2 hover:bg-flone-red hover:border-flone-red hover:text-white transition-all font-bold text-sm uppercase tracking-widest rounded-sm bg-transparent text-page-text">
                  <Heart size={18} /> Wishlist
                </button>
                <button className="flex-1 border border-flone-border dark:border-gray-700 py-3 flex justify-center items-center gap-2 hover:bg-flone-red hover:border-flone-red hover:text-white transition-all font-bold text-sm uppercase tracking-widest rounded-sm bg-transparent text-page-text">
                  <Share2 size={18} /> Share
                </button>
              </div>
            </div>

            <div className="h-px bg-flone-border dark:bg-gray-800 w-full"></div>

            {/* Features/Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-flone-gray dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-flone-red group-hover:bg-flone-red group-hover:text-white transition-colors">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-page-heading uppercase tracking-wider">Free Shipping</h4>
                  <p className="text-xs text-gray-500 font-bold">On orders over $200</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-flone-gray dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-flone-red group-hover:bg-flone-red group-hover:text-white transition-colors">
                  <RotateCcw size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-page-heading uppercase tracking-wider">Easy Returns</h4>
                  <p className="text-xs text-gray-500 font-bold">30 days return policy</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-flone-gray dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-flone-red group-hover:bg-flone-red group-hover:text-white transition-colors">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-page-heading uppercase tracking-wider">Secure Payment</h4>
                  <p className="text-xs text-gray-500 font-bold">100% secure payment</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 bg-flone-gray dark:bg-[#1a1a1a] rounded-full flex items-center justify-center text-flone-red group-hover:bg-flone-red group-hover:text-white transition-colors">
                  <Star size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-page-heading uppercase tracking-wider">High Quality</h4>
                  <p className="text-xs text-gray-500 font-bold">Verified manufacturer</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-page-heading tracking-widest">Availability:</span>
                <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-600' : 'text-flone-red'}`}>
                  {product.stock > 0 ? `${product.stock} Units In Stock` : 'Out of Stock'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-page-heading tracking-widest">SKU:</span>
                <span className="text-xs font-bold text-gray-500 uppercase">{product.id.substring(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
