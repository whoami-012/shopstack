import { useState, useEffect } from 'react';
import { productService } from '../api/productService';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PackagePlus, ArrowLeft, Tag, DollarSign, Layers, AlignLeft, Eye, Box, Info, ImagePlus, Upload, X } from 'lucide-react';

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
        setError('Failed to fetch product details.');
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
      setError(err.response?.data?.detail || 'Failed to upload image.');
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
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.detail || `Failed to ${isEditMode ? 'update' : 'add'} product. Please check your inputs.`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-page-bg transition-colors duration-500">
      <div className="p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 border-b border-shopstack-border dark:border-gray-800 pb-10">
          <div className="flex items-center gap-4">
            <Link 
              to="/products"
              className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm"
            >
              <ArrowLeft size={22} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-page-heading flex items-center gap-3">
                <PackagePlus className="text-indigo-600 dark:text-indigo-400" size={32} />
                {isEditMode ? 'Edit Product' : 'Publish Product'}
              </h1>
              <p className="mt-1 text-sm text-page-text font-medium">
                {isEditMode ? 'Update the details of your listing.' : 'Create a new listing for your store catalog.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 items-start pb-10">
          {/* Form Column */}
          <div className="xl:col-span-3 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
              <div className="p-8 sm:p-10">
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <Info size={18} className="text-indigo-500" />
                  <h3 className="font-bold text-page-heading text-lg">Product Information</h3>
                </div>

                {error && (
                  <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center shadow-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Image Upload Area */}
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-page-text ml-1">Product Image</label>
                    <div className="relative group">
                      {!formData.image_url ? (
                        <label className={`flex flex-col items-center justify-center w-full h-48 bg-slate-50/50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2rem] cursor-pointer hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 hover:border-indigo-500 transition-all duration-300 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                            ) : (
                              <ImagePlus size={48} className="text-slate-400 group-hover:text-indigo-500 transition-colors mb-4" />
                            )}
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                              {isUploading ? 'Uploading Image...' : 'Drop image or Click to upload'}
                            </p>
                          </div>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={isUploading} />
                        </label>
                      ) : (
                        <div className="relative w-full h-48 rounded-[2rem] overflow-hidden group">
                          <img 
                            src={`/api-proxy/product${formData.image_url.startsWith('/') ? '' : '/'}${formData.image_url}`} 
                            alt="Product preview" 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button 
                              type="button"
                              onClick={removeImage}
                              className="p-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all transform hover:scale-110 border-none cursor-pointer"
                            >
                              <X size={20} />
                            </button>
                            <label className="p-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all transform hover:scale-110 cursor-pointer">
                              <Upload size={20} />
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-page-text ml-1">Title</label>
                    <div className="relative group text-left">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Tag size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-page-text placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 font-medium"
                        placeholder="e.g. Wireless Noise-Cancelling Headphones"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-page-text ml-1">Category</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <Box size={18} />
                      </div>
                      <select
                        required
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-page-text focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 font-medium appearance-none cursor-pointer"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="" disabled>Select a category</option>
                        {CATEGORY_PRESETS.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-left">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-page-text ml-1">Price</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                          <DollarSign size={18} />
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-page-text placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 font-medium"
                          placeholder="0.00"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-page-text ml-1">Stock Units</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                          <Layers size={18} />
                        </div>
                        <input
                          type="number"
                          min="0"
                          required
                          className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-page-text placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 font-medium"
                          placeholder="0"
                          value={formData.stock || ''}
                          onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-page-text ml-1">Description</label>
                    <div className="relative group">
                      <div className="absolute top-4 left-0 pl-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                        <AlignLeft size={18} />
                      </div>
                      <textarea
                        required
                        rows={6}
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-page-text placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 resize-none font-medium"
                        placeholder="Share the story and details about this product..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                      className="flex-[2] flex justify-center items-center py-4 px-6 rounded-2xl text-base font-black text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-all duration-300 disabled:opacity-70 shadow-lg shadow-indigo-600/20 active:scale-95 border-none cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                          Publishing...
                        </>
                      ) : (
                        'Publish Product'
                      )}
                    </button>
                    <Link
                      to="/products"
                      className="flex-1 flex justify-center items-center py-4 px-6 border-2 border-slate-200 dark:border-slate-700 rounded-2xl text-base font-bold text-page-text bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 active:scale-95 no-underline"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Preview Column */}
          <div className="xl:col-span-2 sticky top-24">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 ml-2">
                <Eye size={18} />
                <span className="text-sm font-bold uppercase tracking-wider">Live Preview</span>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl dark:shadow-indigo-900/10 transition-colors">
                <div className="h-64 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center relative group">
                  {formData.image_url ? (
                    <img 
                      src={`/api-proxy/product${formData.image_url.startsWith('/') ? '' : '/'}${formData.image_url}`} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Box size={80} className="text-slate-200 dark:text-slate-700 transition-all duration-500 group-hover:scale-110" />
                  )}
                  <div className="absolute top-6 right-6 bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-sm font-black shadow-lg">
                    ${formData.price ? formData.price.toFixed(2) : '0.00'}
                  </div>
                </div>
                
                <div className="p-8 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`h-4 rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${formData.category ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 w-16 animate-pulse'}`}>
                        {formData.category || ''}
                      </div>
                    </div>
                    <div className={`h-7 rounded-lg transition-all duration-300 ${formData.name ? 'bg-transparent' : 'bg-slate-100 dark:bg-slate-800 w-3/4 animate-pulse'}`}>
                      {formData.name && <h3 className="text-xl font-black text-page-heading line-clamp-1">{formData.name}</h3>}
                    </div>
                  </div>
                  
                  <div className={`rounded-lg transition-all duration-300 ${formData.description ? 'bg-transparent' : 'bg-slate-50 dark:bg-slate-800 py-1'}`}>
                    {formData.description ? (
                      <p className="text-page-text text-sm leading-relaxed line-clamp-4 font-medium">{formData.description}</p>
                    ) : (
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full animate-pulse"></div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-5/6 animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{formData.stock || 0} units available</span>
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
