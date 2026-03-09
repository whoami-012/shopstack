import { useEffect, useState, useMemo } from 'react';
import { productService } from '../api/productService';
import type { ProductRead } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link } from 'react-router-dom';
import winterHero from '../assets/winter-offer.jpg';
import { 
  Plus, 
  Search, 
  ShoppingCart,
  Eye,
  Heart,
  Repeat
} from 'lucide-react';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState('New Arrivals');
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const CATEGORIES = ["All", "General", "Electronics", "Clothing", "Home & Kitchen", "Beauty", "Sports", "Books", "Other"];

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [selectedCategory, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      const { data } = await productService.listProducts(params);
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: ProductRead) => {
    setAddingToCartId(product.id);
    try {
      await addToCart({
        product_id: product.id,
        name: product.name,
        quantity: 1
      });
      showToast(`Added ${product.name} to cart!`, 'success');
    } catch (err) {
      console.error("Failed to add to cart", err);
      showToast("Failed to add to cart. Please try again.", "error");
    } finally {
      setAddingToCartId(null);
    }
  };

  const filteredProducts = useMemo(() => {
    // Keep client-side filter as an extra layer of responsiveness, but make it null-safe
    return products.filter(p => 
      (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-shopstack-red"></div>
    </div>
  );

  return (
    <div className="w-full flex-grow bg-page-bg">
      
      <div className="relative mb-20 overflow-hidden min-h-[500px] lg:min-h-[600px] flex items-center transition-colors duration-500">
        {/* Background Image Fill */}
        <div className="absolute inset-0 z-0">
          <img 
            src={winterHero} 
            alt="Winter Background" 
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle gradient overlay to help text stand out */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent dark:from-black/80 dark:via-black/40 dark:to-transparent"></div>
        </div>

        <div className="shopstack-container relative z-10 w-full">
          <div className="max-w-2xl">
            <h3 className="text-shopstack-red font-bold text-lg sm:text-xl uppercase tracking-[0.3em] mb-4">New Arrivals</h3>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-page-heading leading-[1.1] mb-8 tracking-tighter">
              Winter Offer <br/> 2026 Collection
            </h1>
            <p className="text-page-text text-xl mb-10 opacity-90 font-bold max-w-md">
              Discover the latest trends in winter fashion with our exclusive collection.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-shopstack-dark text-white dark:bg-white dark:text-shopstack-dark hover:bg-shopstack-red dark:hover:bg-shopstack-red dark:hover:text-white transition-all duration-300 px-12 py-4 uppercase text-sm tracking-widest font-black shadow-2xl shadow-black/20">
                Explore Now
              </button>
              <button className="bg-white/20 backdrop-blur-md border-2 border-page-heading text-page-heading hover:bg-page-heading hover:text-white dark:hover:text-black transition-all duration-300 px-12 py-4 uppercase text-sm tracking-widest font-black">
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shopstack-container pb-24">
        
        {/* Section Title & Tabs */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-page-heading mb-6 uppercase tracking-wider">Daily Deals!</h2>
          
          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 px-6 py-2.5 rounded-full border ${selectedCategory === cat ? 'bg-shopstack-red border-shopstack-red text-white shadow-lg shadow-shopstack-red/20' : 'bg-transparent border-shopstack-border text-gray-400 hover:text-shopstack-red hover:border-shopstack-red'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {['New Arrivals', 'Best Sellers', 'Sale Items'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-medium transition-colors border-none bg-transparent cursor-pointer ${activeTab === tab ? 'text-page-heading border-b-2 border-shopstack-red pb-1' : 'text-gray-400 hover:text-page-heading'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4">
          <div className="relative w-full sm:w-80">
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-shopstack-border dark:border-gray-700 py-2 pl-2 pr-10 focus:outline-none focus:border-shopstack-red transition-colors text-page-text placeholder-gray-400"
            />
            <Search size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          {(user?.role === 'admin' || user?.role === 'seller') && (
            <Link 
              to="/products/add" 
              className="bg-shopstack-dark dark:bg-white text-white dark:text-shopstack-dark px-6 py-2.5 hover:bg-shopstack-red dark:hover:bg-shopstack-red dark:hover:text-white transition-colors flex items-center text-sm font-bold uppercase tracking-wider"
            >
              <Plus size={18} className="mr-2" /> Add Product
            </Link>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
            {filteredProducts.map((p) => (
              <div key={p.id} className="group cursor-pointer">
                {/* Image Area wrapped in Link */}
                <Link to={`/products/${p.id}`} className="no-underline block">
                  <div className="relative overflow-hidden bg-shopstack-gray dark:bg-[#1a1a1a] aspect-[3/4] mb-3 sm:mb-4 transition-colors duration-500 rounded-sm">
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 flex flex-col gap-1 sm:gap-2">
                      {p.stock <= 5 && p.stock > 0 && <span className="bg-shopstack-red text-white text-[9px] sm:text-[11px] font-bold uppercase px-2 py-1 sm:px-3 sm:py-1">-10%</span>}
                      {p.stock === 0 && <span className="bg-black text-white text-[9px] sm:text-[11px] font-bold uppercase px-2 py-1 sm:px-3 sm:py-1">Out of Stock</span>}
                    </div>
                    
                    {p.image_url ? (
                      <img 
                        src={`/api-proxy/product${p.image_url.startsWith('/') ? '' : '/'}${p.image_url}`} 
                        alt={p.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                        <span className="font-bold text-4xl opacity-20 uppercase">{p.name.substring(0, 2)}</span>
                      </div>
                    )}

                    <div className="absolute right-4 top-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button 
                        onClick={(e) => { e.preventDefault(); /* handle wishlist */ }}
                        className="w-10 h-10 bg-white dark:bg-[#222] text-page-heading flex items-center justify-center hover:bg-shopstack-red hover:text-white dark:hover:bg-shopstack-red shadow-sm transition-colors rounded-sm border-none cursor-pointer"
                      >
                        <Heart size={18} />
                      </button>
                      <button className="w-10 h-10 bg-white dark:bg-[#222] text-page-heading flex items-center justify-center hover:bg-shopstack-red hover:text-white dark:hover:bg-shopstack-red shadow-sm transition-colors rounded-sm border-none cursor-pointer">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={(e) => { e.preventDefault(); /* handle compare */ }}
                        className="w-10 h-10 bg-white dark:bg-[#222] text-page-heading flex items-center justify-center hover:bg-shopstack-red hover:text-white dark:hover:bg-shopstack-red shadow-sm transition-colors rounded-sm border-none cursor-pointer"
                      >
                        <Repeat size={18} />
                      </button>
                    </div>

                    <div className="absolute bottom-0 left-0 w-full translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <button 
                        onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}
                        disabled={addingToCartId === p.id || p.stock === 0}
                        className="w-full bg-shopstack-red text-white py-3 font-medium uppercase text-sm tracking-wider hover:bg-black transition-colors flex justify-center items-center gap-2 border-none cursor-pointer disabled:opacity-50"
                      >
                        <ShoppingCart size={18} /> {addingToCartId === p.id ? 'Adding...' : 'Add To Cart'}
                      </button>
                    </div>
                  </div>
                </Link>

                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {p.category}
                  </div>
                  <h3 className="text-page-heading text-base hover:text-shopstack-red transition-colors mb-1">
                    <Link to={`/products/${p.id}`} className="no-underline text-inherit">{p.name}</Link>
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-shopstack-red font-bold">${p.price.toFixed(2)}</span>
                    <span className="text-gray-400 line-through">${(p.price * 1.2).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border border-shopstack-border dark:border-gray-800 border-dashed">
            <h3 className="text-2xl font-bold text-shopstack-dark dark:text-white mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-8">We couldn't find anything matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="bg-shopstack-red text-white px-8 py-3 uppercase text-sm font-bold tracking-wider hover:bg-shopstack-dark transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
