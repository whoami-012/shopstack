import { useEffect, useState, useMemo } from 'react';
import { productService } from '../api/productService';
import type { ProductRead } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('New Arrivals');
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productService.listProducts();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-flone-red"></div>
    </div>
  );

  return (
    <div className="w-full flex-grow bg-page-bg">
      
      {/* Hero Section */}
      <div className="bg-flone-gray dark:bg-[#1a1a1a] py-20 lg:py-32 mb-20 relative overflow-hidden transition-colors duration-500">
        <div className="flone-container relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          <div>
            <h3 className="text-flone-red font-medium text-lg sm:text-xl uppercase tracking-widest mb-4">Smart Products</h3>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-page-heading leading-tight mb-8">
              Winter Offer <br/> 2026 Collection
            </h1>
            <button className="bg-transparent border-2 border-page-heading text-page-heading hover:bg-flone-red hover:border-flone-red hover:text-white transition-all duration-300 px-10 py-4 uppercase text-sm tracking-wider font-bold">
              Shop Now
            </button>
          </div>
          <div className="hidden lg:flex justify-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white dark:bg-[#222] rounded-full opacity-50 blur-3xl"></div>
            <div className="w-full max-w-md aspect-square bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center relative z-10 animate-pulse">
              <span className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest">Product Image</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flone-container pb-24">
        
        {/* Section Title & Tabs */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-page-heading mb-6 uppercase tracking-wider">Daily Deals!</h2>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {['New Arrivals', 'Best Sellers', 'Sale Items'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-lg font-medium transition-colors border-none bg-transparent cursor-pointer ${activeTab === tab ? 'text-page-heading border-b-2 border-flone-red pb-1' : 'text-gray-400 hover:text-page-heading'}`}
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
              className="w-full bg-transparent border-b border-flone-border dark:border-gray-700 py-2 pl-2 pr-10 focus:outline-none focus:border-flone-red transition-colors text-page-text placeholder-gray-400"
            />
            <Search size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          {(user?.role === 'admin' || user?.role === 'seller') && (
            <Link 
              to="/products/add" 
              className="bg-flone-dark dark:bg-white text-white dark:text-flone-dark px-6 py-2.5 hover:bg-flone-red dark:hover:bg-flone-red dark:hover:text-white transition-colors flex items-center text-sm font-bold uppercase tracking-wider"
            >
              <Plus size={18} className="mr-2" /> Add Product
            </Link>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((p) => (
              <div key={p.id} className="group">
                {/* Image Area */}
                <div className="relative overflow-hidden bg-flone-gray dark:bg-[#1a1a1a] aspect-[3/4] mb-4 transition-colors duration-500">
                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {p.stock <= 5 && p.stock > 0 && <span className="bg-flone-red text-white text-[11px] font-bold uppercase px-3 py-1">-10%</span>}
                    {p.stock === 0 && <span className="bg-black text-white text-[11px] font-bold uppercase px-3 py-1">Out of Stock</span>}
                  </div>
                  
                  {p.image_url ? (
                    <img 
                      src={`/api-proxy/product${p.image_url}`} 
                      alt={p.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-700">
                      <span className="font-bold text-4xl opacity-20 uppercase">{p.name.substring(0, 2)}</span>
                    </div>
                  )}

                  <div className="absolute right-4 top-4 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button className="w-10 h-10 bg-white dark:bg-[#222] text-page-heading flex items-center justify-center hover:bg-flone-red hover:text-white dark:hover:bg-flone-red shadow-sm transition-colors rounded-sm border-none cursor-pointer">
                      <Heart size={18} />
                    </button>
                    <Link 
                      to={`/products/${p.id}`}
                      className="w-10 h-10 bg-white dark:bg-[#222] text-page-heading flex items-center justify-center hover:bg-flone-red hover:text-white dark:hover:bg-flone-red shadow-sm transition-colors rounded-sm border-none cursor-pointer no-underline"
                    >
                      <Eye size={18} />
                    </Link>
                    <button className="w-10 h-10 bg-white dark:bg-[#222] text-page-heading flex items-center justify-center hover:bg-flone-red hover:text-white dark:hover:bg-flone-red shadow-sm transition-colors rounded-sm border-none cursor-pointer">
                      <Repeat size={18} />
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                    <button className="w-full bg-flone-red text-white py-3 font-medium uppercase text-sm tracking-wider hover:bg-black transition-colors flex justify-center items-center gap-2 border-none cursor-pointer">
                      <ShoppingCart size={18} /> Add To Cart
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    {p.category}
                  </div>
                  <h3 className="text-page-heading text-base hover:text-flone-red transition-colors mb-1">
                    <Link to={`/products/${p.id}`} className="no-underline text-inherit">{p.name}</Link>
                  </h3>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-flone-red font-bold">${p.price.toFixed(2)}</span>
                    <span className="text-gray-400 line-through">${(p.price * 1.2).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border border-flone-border dark:border-gray-800 border-dashed">
            <h3 className="text-2xl font-bold text-flone-dark dark:text-white mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-8">We couldn't find anything matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="bg-flone-red text-white px-8 py-3 uppercase text-sm font-bold tracking-wider hover:bg-flone-dark transition-colors"
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
