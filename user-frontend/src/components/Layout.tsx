import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart,
  Menu,
  X,
  MapPin,
  Globe,
  Sun,
  Moon,
  Layers,
  HelpCircle
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showLiveResults, setShowLiveResults] = useState(false);

  useEffect(() => {
    if (headerSearch.trim().length >= 2) {
      const delayDebounceFn = setTimeout(async () => {
        setIsSearching(true);
        try {
          const { data } = await productService.listProducts({ search: headerSearch });
          setLiveResults(data.slice(0, 5));
          setShowLiveResults(true);
        } catch (err) {
          console.error("Live search failed", err);
        } finally {
          setIsSearching(false);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setLiveResults([]);
      setShowLiveResults(false);
    }
  }, [headerSearch]);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
      setShowLiveResults(false);
    }
  };

  const isActive = (path: string) => {
    if (path === '/products' && location.pathname === '/products') return true;
    if (path !== '/products' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col font-sans text-shopstack-black dark:text-white transition-colors duration-300">
      
      {/* ShopStack Utility Bar */}
      <div className="bg-shopstack-black text-white py-2 hidden md:block">
        <div className="shopstack-container flex justify-between items-center text-[11px] font-bold tracking-tight">
          <div className="flex items-center space-x-6">
            <button className="flex items-center gap-1.5 hover:text-shopstack-red bg-transparent border-none text-white cursor-pointer transition-colors">
              <Globe size={14} />
              EN
            </button>
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-1.5 hover:text-shopstack-red bg-transparent border-none text-white cursor-pointer transition-colors"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              {theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}
            </button>
            <span className="text-neutral-500 font-medium">Free express delivery on orders over Rs. 50,000</span>
          </div>
          <div className="flex items-center space-x-6">
            <button className="flex items-center gap-1.5 hover:text-shopstack-red bg-transparent border-none text-white cursor-pointer transition-colors">
              <HelpCircle size={14} />
              SUPPORT
            </button>
            <button className="flex items-center gap-1.5 hover:text-shopstack-red bg-transparent border-none text-white cursor-pointer transition-colors">
              <MapPin size={14} />
              TRACK ORDER
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
        <div className="shopstack-container py-4 flex items-center gap-8">
          
          {/* ShopStack Logo */}
          <Link to="/products" className="flex items-center gap-2 no-underline group flex-shrink-0">
            <div className="w-9 h-9 bg-shopstack-red rounded-lg flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform shadow-lg shadow-shopstack-red/20">
              <Layers size={22} fill="currentColor" />
            </div>
            <span className="text-xl font-black tracking-tighter text-shopstack-black dark:text-white">
              SHOP<span className="text-shopstack-red">STACK</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden xl:flex items-center space-x-8">
            <Link to="/products" className={`text-[13px] font-bold uppercase tracking-wider hover:text-shopstack-red no-underline transition-colors ${isActive('/products') ? 'text-shopstack-red' : 'text-shopstack-black dark:text-white'}`}>
              Browse
            </Link>
            <Link to="/dashboard" className={`text-[13px] font-bold uppercase tracking-wider hover:text-shopstack-red no-underline transition-colors ${isActive('/dashboard') ? 'text-shopstack-red' : 'text-shopstack-black dark:text-white'}`}>
              Profile
            </Link>
            {(user?.role === 'admin' || user?.role === 'seller') && (
              <Link to="/products/add" className={`text-[13px] font-bold uppercase tracking-wider hover:text-shopstack-red no-underline transition-colors ${isActive('/products/add') ? 'text-shopstack-red' : 'text-shopstack-black dark:text-white'}`}>
                List Item
              </Link>
            )}
            <Link to="/products" className="text-[13px] font-bold uppercase tracking-wider hover:text-shopstack-red no-underline text-shopstack-black dark:text-white transition-colors">
              Exclusive
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin/users" className={`text-[13px] font-bold uppercase tracking-wider hover:text-shopstack-red no-underline transition-colors ${isActive('/admin/users') ? 'text-shopstack-red' : 'text-shopstack-black dark:text-white'}`}>
                Admin
              </Link>
            )}
          </nav>

          {/* Search */}
          <div className="flex-grow relative max-w-xl hidden md:block">
            <form onSubmit={handleHeaderSearch} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-shopstack-red transition-colors">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search products, brands and more..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="shopstack-input !pl-12 !py-2.5 text-sm"
                onFocus={() => headerSearch.length >= 2 && setShowLiveResults(true)}
              />
            </form>

            {/* Live Search Results */}
            {showLiveResults && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-neutral-900 shadow-2xl rounded-xl border border-neutral-100 dark:border-neutral-800 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                {isSearching ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin h-5 w-5 border-2 border-shopstack-red border-t-transparent rounded-full mx-auto"></div>
                  </div>
                ) : liveResults.length > 0 ? (
                  <div className="p-2">
                    {liveResults.map(p => (
                      <Link 
                        key={p.id} 
                        to={`/products/${p.id}`} 
                        onClick={() => setShowLiveResults(false)}
                        className="flex items-center gap-4 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg no-underline group transition-colors"
                      >
                        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-md overflow-hidden flex-shrink-0">
                          {p.image_url && (
                            <img src={`/api-proxy/product${p.image_url}`} alt={p.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-shopstack-black dark:text-white group-hover:text-shopstack-red">{p.name}</p>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{p.category}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-neutral-500 font-medium font-bold">No items found</div>
                )}
                <div className="bg-neutral-50 dark:bg-neutral-800/50 p-3 text-center border-t border-neutral-100 dark:border-neutral-800">
                  <button onClick={handleHeaderSearch} className="text-xs font-black text-shopstack-red hover:underline bg-transparent border-none cursor-pointer uppercase tracking-widest">
                    View all results
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-1 md:space-x-3 ml-auto">
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-all bg-transparent border-none cursor-pointer group"
              >
                <User size={22} className="text-shopstack-black dark:text-white group-hover:text-shopstack-red" />
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-neutral-900 shadow-2xl rounded-xl border border-neutral-100 dark:border-neutral-800 py-4 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  {user ? (
                    <>
                      <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-800 mb-2">
                        <p className="text-sm font-black truncate uppercase tracking-tight">Hej {user.username}!</p>
                        <p className="text-[10px] text-shopstack-red font-bold uppercase tracking-widest">{user.role}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-6 py-3 text-[13px] font-bold text-shopstack-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 no-underline transition-colors">Account Dashboard</Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-6 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 border-none bg-transparent cursor-pointer transition-colors">Sign out</button>
                    </>
                  ) : (
                    <div className="px-6 py-2">
                      <p className="text-sm font-black mb-4 uppercase tracking-tight">Account</p>
                      <Link to="/login" onClick={() => setUserMenuOpen(false)} className="btn-primary !w-full !py-2.5 !text-[12px] mb-2 no-underline shadow-lg shadow-shopstack-red/20">Login</Link>
                      <Link to="/register" onClick={() => setUserMenuOpen(false)} className="block text-center text-[11px] font-bold text-neutral-500 hover:text-shopstack-black dark:hover:text-white no-underline mt-4 uppercase tracking-widest transition-colors">Create account</Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-all bg-transparent border-none cursor-pointer group">
              <Heart size={22} className="text-shopstack-black dark:text-white group-hover:text-shopstack-red" />
            </button>

            <Link to="/cart" className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-all no-underline group relative">
              <ShoppingCart size={22} className="text-shopstack-black dark:text-white group-hover:text-shopstack-red" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 bg-shopstack-red text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black animate-in zoom-in duration-300">
                  {itemCount}
                </span>
              )}
            </Link>

            <button 
              className="xl:hidden p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full bg-transparent border-none cursor-pointer text-shopstack-black dark:text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <div className={`fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)}>
        <div 
          className={`fixed inset-y-0 left-0 w-[85vw] max-w-[320px] bg-white dark:bg-black shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Layers size={20} className="text-shopstack-red" fill="currentColor" />
              <span className="font-black tracking-tighter">SHOPSTACK</span>
            </div>
            <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 hover:text-shopstack-black dark:hover:text-white rounded-full p-2 bg-transparent border-none cursor-pointer transition-colors"><X size={24} /></button>
          </div>
          
          <nav className="p-6 flex flex-col space-y-6 flex-grow overflow-y-auto uppercase tracking-widest font-black text-xs">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-shopstack-black dark:text-white no-underline hover:text-shopstack-red transition-colors">Browse Products</Link>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-shopstack-black dark:text-white no-underline hover:text-shopstack-red transition-colors">My Profile</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-shopstack-black dark:text-white no-underline hover:text-shopstack-red transition-colors">Special Offers</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="text-shopstack-black dark:text-white no-underline hover:text-shopstack-red transition-colors">Admin Panel</Link>
            )}
          </nav>
          
          <div className="p-6 border-t border-neutral-100 dark:border-neutral-800">
            {user ? (
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }} 
                className="btn-secondary !w-full !rounded-md uppercase tracking-widest text-[10px]"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary !w-full no-underline uppercase tracking-widest text-[10px]">Log In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-secondary !w-full no-underline uppercase tracking-widest text-[10px]">Create Account</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <Outlet />
      </main>

      {/* ShopStack Footer */}
      <footer className="bg-shopstack-bg-gray dark:bg-neutral-950 pt-24 pb-12 mt-20 border-t border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
        <div className="shopstack-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-20 border-b border-neutral-200 dark:border-neutral-800">
            <div className="space-y-8">
              <div className="flex items-center gap-2">
                <Layers size={24} className="text-shopstack-red" fill="currentColor" />
                <span className="text-xl font-black tracking-tighter">SHOPSTACK</span>
              </div>
              <p className="text-sm text-neutral-500 font-medium leading-relaxed max-w-xs">
                Premium retail experience powered by modern technology. Elevating your everyday lifestyle with curated collections.
              </p>
              <div className="flex gap-4">
                <button className="btn-primary !bg-shopstack-black !px-6 !py-2.5 !text-xs !rounded-md uppercase tracking-widest">Join Now</button>
              </div>
            </div>
            <div>
              <h4 className="text-[13px] font-black uppercase tracking-[0.2em] mb-8 dark:text-white">Quick Links</h4>
              <ul className="space-y-4 text-[13px] list-none p-0 font-medium">
                <li><Link to="/products" className="hover:text-shopstack-red no-underline text-neutral-500 transition-colors">Catalog</Link></li>
                <li><Link to="#" className="hover:text-shopstack-red no-underline text-neutral-500 transition-colors">Track Order</Link></li>
                <li><Link to="#" className="hover:text-shopstack-red no-underline text-neutral-500 transition-colors">Size Guide</Link></li>
                <li><Link to="#" className="hover:text-shopstack-red no-underline text-neutral-500 transition-colors">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[13px] font-black uppercase tracking-[0.2em] mb-8 dark:text-white">Support</h4>
              <ul className="space-y-4 text-[13px] list-none p-0 font-medium">
                <li><Link to="#" className="hover:text-shopstack-red no-underline text-neutral-500 transition-colors">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-shopstack-red no-underline text-neutral-500 transition-colors">Shipping Info</Link></li>
                <li><Link to="#" className="hover:text-shopstack-red no-underline text-neutral-500 transition-colors">Help Center</Link></li>
                <li><Link to="#" className="hover:text-shopstack-red no-underline text-neutral-500 transition-colors">Privacy</Link></li>
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[13px] font-black uppercase tracking-[0.2em] mb-8 dark:text-white">Newsletter</h4>
              <p className="text-sm text-neutral-500 font-medium">Get the latest updates on new arrivals and sales.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Email" className="bg-white dark:bg-neutral-900 border-none px-4 py-2 rounded-md text-xs w-full focus:ring-2 focus:ring-shopstack-red/20 outline-none" />
                <button className="bg-shopstack-red text-white px-4 py-2 rounded-md font-bold text-xs uppercase transition-all active:scale-95">Go</button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">© 2026 SHOPSTACK INTERACTIVE. ALL RIGHTS RESERVED.</p>
            <div className="flex flex-wrap justify-center gap-8 text-[11px] font-black text-neutral-400 uppercase tracking-widest">
              <span className="hover:text-shopstack-red cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-shopstack-red cursor-pointer transition-colors">Cookies</span>
              <span className="hover:text-shopstack-red cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-shopstack-red cursor-pointer transition-colors">Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
