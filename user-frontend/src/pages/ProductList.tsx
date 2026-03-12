import React, { useEffect, useState } from 'react';
import { productService } from '../api/productService';
import type { ProductRead } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  ShoppingCart,
  Heart,
  ChevronRight,
  Filter,
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const searchQuery = searchParams.get('search') || '';

  const CATEGORIES = ["All", "General", "Electronics", "Clothing", "Home & Kitchen", "Beauty", "Sports", "Books", "Other"];

  useEffect(() => {
    fetchProducts();
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

  const handleAddToCart = async (e: React.MouseEvent, product: ProductRead) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCartId(product.id);
    try {
      await addToCart({
        product_id: product.id,
        name: product.name,
        quantity: 1
      });
      showToast(`${product.name} added to your bag.`, 'success');
    } catch (err) {
      console.error("Failed to add to cart", err);
      showToast("Could not add to bag.", "error");
    } finally {
      setAddingToCartId(null);
    }
  };

  const updateCategory = (cat: string) => {
    setSelectedCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  if (loading && products.length === 0) return (
    <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-shopstack-red border-t-transparent"></div>
    </div>
  );

  return (
    <div className="w-full flex-grow bg-white dark:bg-black transition-colors duration-300">
      
      {/* ShopStack Hero Banner */}
      <div className="shopstack-container py-8">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 aspect-[21/9] flex items-center group">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=2000" 
            alt="New Arrivals" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="relative z-10 p-8 md:p-20 text-white max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-shopstack-red text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Limited Drops</span>
              <span className="text-white/60 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <TrendingUp size={12} /> Trending Now
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.9] !text-white uppercase">
              The Next <br />Generation <br /><span className="text-shopstack-red">Essentials.</span>
            </h1>
            <p className="text-lg font-medium mb-10 opacity-80 !text-white max-w-md">
              Engineered for performance. Styled for the modern era. Shop the latest collection today.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary !rounded-full !px-10 !py-4 shadow-2xl shadow-shopstack-red/40 uppercase tracking-widest text-xs">Shop Collection</button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all">View Lookbook</button>
            </div>
          </div>
        </div>
      </div>

      <div className="shopstack-container py-12">
        
        {/* Navigation & Header */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-10">
          <Link to="/products" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span>Catalog</span>
          {selectedCategory !== 'All' && (
            <>
              <ChevronRight size={12} />
              <span className="text-shopstack-red">{selectedCategory}</span>
            </>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
              {selectedCategory === 'All' ? 'Latest Drops' : selectedCategory}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-neutral-500 text-xs font-black uppercase tracking-widest">{products.length} Items Indexed</span>
              <div className="h-1 w-1 bg-neutral-300 rounded-full" />
              <span className="text-shopstack-red text-xs font-black uppercase tracking-widest flex items-center gap-1">
                <Award size={14} /> Verified Quality
              </span>
            </div>
          </div>
          
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => updateCategory(cat)}
                className={`text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-full border-2 transition-all cursor-pointer ${selectedCategory === cat ? 'bg-shopstack-red border-shopstack-red text-white shadow-lg shadow-shopstack-red/20' : 'bg-transparent border-neutral-100 dark:border-neutral-800 text-neutral-500 hover:border-shopstack-red hover:text-shopstack-red'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-12 border-b border-neutral-100 dark:border-neutral-900 pb-8">
          <div className="flex items-center gap-6">
             {user && (user.role === 'admin' || user.role === 'seller') && (
              <Link 
                to="/products/add" 
                className="btn-primary !py-2.5 !px-6 !text-[10px] !rounded-full uppercase tracking-widest no-underline flex items-center gap-2 shadow-lg shadow-shopstack-red/20"
              >
                <Plus size={14} /> List Item
              </Link>
            )}
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-shopstack-red transition-colors cursor-pointer bg-transparent border-none">
              <Filter size={14} /> Filters
            </button>
          </div>
          
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Sorted by: <span className="text-shopstack-black dark:text-white cursor-pointer hover:text-shopstack-red transition-colors ml-1">Algorithm</span>
          </div>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-16">
            {products.map((p) => (
              <div key={p.id} className="product-card-base group relative">
                <Link to={`/products/${p.id}`} className="no-underline text-inherit block">
                  <div className="product-image-wrapper bg-neutral-50 dark:bg-neutral-950 p-6">
                    {p.image_url ? (
                      <img 
                        src={`/api-proxy/product${p.image_url.startsWith('/') ? '' : '/'}${p.image_url}`} 
                        alt={p.name} 
                        className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Layers size={40} className="text-neutral-200 dark:text-neutral-800" />
                      </div>
                    )}
                    
                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <button 
                      onClick={(e) => handleAddToCart(e, p)}
                      disabled={addingToCartId === p.id || p.stock === 0}
                      className="absolute bottom-4 left-4 right-4 bg-shopstack-black text-white py-3 rounded-lg flex items-center justify-center gap-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 font-black text-[10px] uppercase tracking-widest hover:bg-shopstack-red cursor-pointer disabled:opacity-50"
                    >
                      {addingToCartId === p.id ? (
                        <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <><ShoppingCart size={14} /> Add to Bag</>
                      )}
                    </button>

                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center text-neutral-400 hover:text-shopstack-red transition-all scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 border-none cursor-pointer">
                      <Heart size={18} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest leading-none">{p.category}</p>
                      <span className={`text-[9px] font-black uppercase tracking-tighter ${p.stock <= 5 && p.stock > 0 ? 'text-amber-500' : 'text-neutral-400'}`}>
                        {p.stock > 0 ? `${p.stock} In Stock` : 'Sold Out'}
                      </span>
                    </div>
                    <h3 className="text-[13px] font-bold text-shopstack-black dark:text-white leading-tight group-hover:text-shopstack-red transition-colors truncate uppercase">{p.name}</h3>
                    
                    <div className="price-tag text-shopstack-black dark:text-white pt-1">
                      <span className="price-currency">Rs.</span>
                      <span>{(p.price || 0).toLocaleString()}</span>
                    </div>
                    
                    {p.stock === 0 && (
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pt-2">Sold Out</p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-neutral-50 dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-900">
            <Layers size={48} className="mx-auto text-neutral-200 mb-6" />
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">No items matching your query</h3>
            <p className="text-neutral-500 text-sm font-medium mb-10 max-w-xs mx-auto">Our systems couldn't find any products matching those parameters. Try resetting your filters.</p>
            <button 
              onClick={() => updateCategory('All')}
              className="btn-secondary !rounded-full !px-8 uppercase tracking-widest text-[10px]"
            >
              Clear Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
