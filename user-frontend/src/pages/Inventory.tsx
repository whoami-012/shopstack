import React, { useEffect, useState } from 'react';
import { productService } from '../api/productService';
import type { ProductRead } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Layers, 
  Search, 
  Edit3, 
  Plus, 
  MoreVertical,
  ExternalLink,
  Package,
  AlertCircle
} from 'lucide-react';

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<ProductRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      navigate('/dashboard');
      return;
    }
    fetchProducts();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await productService.listProducts();
      // In a real app, we would filter by seller_id on the backend
      // For now, we show all products as requested by the "option" in dashboard
      setProducts(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to synchronize inventory.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <div className="flex-grow flex items-center justify-center bg-white dark:bg-black min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-shopstack-red border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex-grow bg-white dark:bg-black transition-colors duration-300 pb-24">
      <div className="shopstack-container py-12">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
          <Link to="/dashboard" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Dashboard</Link>
          <ChevronRight size={12} className="rotate-180" />
          <span>Inventory Management</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 dark:border-neutral-900 pb-8 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Workspace Inventory</h1>
            <p className="text-neutral-500 text-sm font-medium">Manage your listed items, track stock levels, and update product parameters.</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Filter by name or category..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="shopstack-input !pl-12 !py-2.5 !text-xs !w-64"
              />
            </div>
            <Link to="/products/add" className="btn-primary !rounded-xl !py-3 !px-6 !text-[10px] uppercase tracking-widest no-underline flex items-center gap-2 shadow-lg shadow-shopstack-red/20">
              <Plus size={14} /> New Listing
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="py-32 text-center bg-neutral-50 dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-900">
            <Package size={48} className="mx-auto text-neutral-200 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Inventory Depleted</h3>
            <p className="text-neutral-500 text-sm font-medium mb-10 max-w-xs mx-auto">No items matching your query were found in the current inventory cluster.</p>
            <button onClick={() => setSearchQuery('')} className="btn-secondary !rounded-full !px-8 uppercase tracking-widest text-[10px]">Reset Workspace</button>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900/50">
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-900">Item Details</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-900">Category</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-900">Price</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-900">Inventory</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 dark:border-neutral-900 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden flex items-center justify-center p-2">
                            {p.image_url ? (
                              <img src={`/api-proxy/product${p.image_url}`} alt={p.name} className="w-full h-full object-contain" />
                            ) : (
                              <Layers size={20} className="text-neutral-300" />
                            )}
                          </div>
                          <div>
                            <p className="text-[13px] font-black uppercase tracking-tight text-shopstack-black dark:text-white group-hover:text-shopstack-red transition-colors">{p.name}</p>
                            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">ID: {p.id.substring(0,8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-xs">
                        Rs. {p.price.toLocaleString()}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 10 ? 'bg-emerald-500' : p.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${p.stock > 10 ? 'text-emerald-600' : p.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                            {p.stock} Units
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/products/${p.id}`}
                            className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-400 hover:text-shopstack-black dark:hover:text-white transition-all"
                            title="View Public Listing"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <Link 
                            to={`/products/edit/${p.id}`}
                            className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-all"
                            title="Update Parameters"
                          >
                            <Edit3 size={16} />
                          </Link>
                          <button className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-900 text-neutral-400 hover:text-shopstack-black dark:hover:text-white transition-all border-none cursor-pointer">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
