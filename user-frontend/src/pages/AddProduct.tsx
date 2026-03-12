import { useState, useEffect } from 'react';
import { productService } from '../api/productService';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Tag, DollarSign, Layers, AlignLeft, Eye, Box, Info, ImagePlus, Upload, X, ChevronRight, Award } from 'lucide-react';

const AddProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    description: '',
    image_url: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const CATEGORY_PRESETS = ["General", "Electronics", "Clothing", "Home & Kitchen", "Beauty", "Sports", "Books", "Other"];

  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'seller') {
      navigate('/products');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isEditMode && id) {
      productService.getProduct(id).then(res => {
        const product = res.data;
        setFormData({
          name: product.name || '',
          category: product.category || '',
          price: product.price || 0,
          stock: product.stock || 0,
          description: product.description || '',
          image_url: product.image_url || '',
        });
      }).catch(() => {
        setError('Failed to fetch product parameters.');
      });
    }
  }, [id, isEditMode]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');
    try {
      const response = await productService.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: response.data.image_url }));
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Image synchronization failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (isEditMode && id) {
        await productService.updateProduct(id, formData);
      } else {
        await productService.createProduct(formData);
      }
      navigate('/dashboard/inventory');
    } catch (err: any) {
      setError(err.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'index'} product. Verify all parameters.`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-grow bg-white dark:bg-black transition-colors duration-300 pb-24">
      <div className="shopstack-container py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
          <Link to="/dashboard" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Dashboard</Link>
          <ChevronRight size={12} className="rotate-180" />
          <Link to="/dashboard/inventory" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Inventory</Link>
          <ChevronRight size={12} className="rotate-180" />
          <span>{isEditMode ? 'Update Listing' : 'New Listing'}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 dark:border-neutral-900 pb-8 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">
              {isEditMode ? 'Update Listing' : 'Publish Product'}
            </h1>
            <p className="text-neutral-500 text-sm font-medium">
              {isEditMode ? 'Modify existing product parameters in the global catalog.' : 'Create a new indexed listing for your workspace.'}
            </p>
          </div>
          <Link to="/dashboard/inventory" className="p-2.5 text-neutral-400 hover:text-shopstack-red transition-all">
            <ArrowLeft size={22} />
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
          {/* Form Column */}
          <div className="xl:col-span-7 space-y-10">
            <div className="bg-neutral-50 dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-900 p-10 shadow-sm transition-colors">
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-neutral-100 dark:border-neutral-900">
                <Info size={18} className="text-shopstack-red" />
                <h3 className="font-black uppercase tracking-widest text-xs">Product Specification</h3>
              </div>

              {error && (
                <div className="mb-10 p-5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Image Upload Area */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Media Assets</label>
                  <div className="relative group">
                    {!formData.image_url ? (
                      <label className={`flex flex-col items-center justify-center w-full h-64 bg-white dark:bg-black border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl cursor-pointer hover:border-shopstack-red transition-all duration-300 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <div className="flex flex-col items-center justify-center">
                          {isUploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-shopstack-red border-t-transparent"></div>
                          ) : (
                            <ImagePlus size={40} className="text-neutral-300 group-hover:text-shopstack-red transition-colors mb-4" />
                          )}
                          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                            {isUploading ? 'Uploading...' : 'Click to upload item image'}
                          </p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={isUploading} />
                      </label>
                    ) : (
                      <div className="relative w-full h-64 rounded-2xl overflow-hidden group border border-neutral-100 dark:border-neutral-900">
                        <img 
                          src={`/api-proxy/product${formData.image_url.startsWith('/') ? '' : '/'}${formData.image_url}`} 
                          alt="Product preview" 
                          className="w-full h-full object-contain p-8 bg-white dark:bg-black"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <button 
                            type="button"
                            onClick={removeImage}
                            className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all transform hover:scale-110 border-none cursor-pointer"
                          >
                            <X size={20} />
                          </button>
                          <label className="p-3 bg-shopstack-black text-white rounded-xl hover:bg-shopstack-red transition-all transform hover:scale-110 cursor-pointer">
                            <Upload size={20} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Display Name</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-shopstack-red transition-colors">
                      <Tag size={18} />
                    </div>
                    <input
                      type="text"
                      required
                      className="shopstack-input !pl-12"
                      placeholder="e.g. Premium Ergonomic Seating"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Inventory Category</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-shopstack-red transition-colors">
                      <Box size={18} />
                    </div>
                    <select
                      required
                      className="shopstack-input !pl-12 appearance-none cursor-pointer"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="" disabled>Select Segment</option>
                      {CATEGORY_PRESETS.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Market Price (Rs)</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-shopstack-red transition-colors">
                        <DollarSign size={18} />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        className="shopstack-input !pl-12"
                        placeholder="0.00"
                        value={formData.price || ''}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Stock Units</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-shopstack-red transition-colors">
                        <Layers size={18} />
                      </div>
                      <input
                        type="number"
                        min="0"
                        required
                        className="shopstack-input !pl-12"
                        placeholder="0"
                        value={formData.stock || ''}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Description Manifest</label>
                  <div className="relative group">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none text-neutral-400 group-focus-within:text-shopstack-red transition-colors">
                      <AlignLeft size={18} />
                    </div>
                    <textarea
                      required
                      rows={6}
                      className="shopstack-input !pl-12 !py-4 resize-none"
                      placeholder="Specify technical details and item story..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-100 dark:border-neutral-900">
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="flex-[2] btn-primary !rounded-xl !py-5 uppercase tracking-widest text-xs shadow-2xl shadow-shopstack-red/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Synchronizing...
                      </span>
                    ) : (
                      isEditMode ? 'Update Parameters' : 'Publish to Catalog'
                    )}
                  </button>
                  <Link
                    to="/dashboard/inventory"
                    className="flex-1 btn-secondary !bg-white dark:!bg-transparent !text-shopstack-black dark:!text-white !border !border-neutral-200 dark:!border-neutral-800 !rounded-xl !py-5 uppercase tracking-widest text-xs no-underline text-center"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Column */}
          <div className="xl:col-span-5 sticky top-32">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-neutral-400 ml-4">
                <Eye size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Live Catalog Preview</span>
              </div>
              
              <div className="bg-white dark:bg-neutral-950 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-900 overflow-hidden shadow-2xl transition-colors">
                <div className="h-80 bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-center relative group p-12">
                  {formData.image_url ? (
                    <img 
                      src={`/api-proxy/product${formData.image_url.startsWith('/') ? '' : '/'}${formData.image_url}`} 
                      alt="Preview" 
                      className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-700"
                    />
                  ) : (
                    <Layers size={80} className="text-neutral-200 dark:text-neutral-800" />
                  )}
                  <div className="absolute top-8 right-8 bg-shopstack-red text-white px-5 py-2 rounded-xl text-xs font-black shadow-xl shadow-shopstack-red/20">
                    Rs. {formData.price ? formData.price.toLocaleString() : '0'}
                  </div>
                </div>
                
                <div className="p-10 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`h-4 rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${formData.category ? 'bg-shopstack-red/10 text-shopstack-red' : 'bg-neutral-100 dark:bg-neutral-800 w-24 animate-pulse'}`}>
                        {formData.category || ''}
                      </div>
                      <div className="h-1 w-1 bg-neutral-300 rounded-full" />
                      <div className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Nexus Verified</div>
                    </div>
                    <div className={`transition-all duration-300 ${formData.name ? '' : 'h-8 bg-neutral-100 dark:bg-neutral-800 rounded-lg w-3/4 animate-pulse'}`}>
                      {formData.name && <h3 className="text-2xl font-black text-shopstack-black dark:text-white uppercase tracking-tight">{formData.name}</h3>}
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-300 ${formData.description ? '' : 'space-y-2'}`}>
                    {formData.description ? (
                      <p className="text-neutral-500 text-xs leading-relaxed font-medium line-clamp-4">{formData.description}</p>
                    ) : (
                      <>
                        <div className="h-3 bg-neutral-50 dark:bg-neutral-800 rounded w-full animate-pulse"></div>
                        <div className="h-3 bg-neutral-50 dark:bg-neutral-800 rounded w-5/6 animate-pulse"></div>
                      </>
                    )}
                  </div>
                  
                  <div className="pt-8 border-t border-neutral-100 dark:border-neutral-900">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${formData.stock > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{formData.stock || 0} Units in Workspace</span>
                      </div>
                      <Award size={18} className="text-neutral-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
