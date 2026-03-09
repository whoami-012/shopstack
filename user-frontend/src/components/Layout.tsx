import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { productService } from '../api/productService';
import { 
  Search, 
  User, 
  Heart, 
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [liveResults, setLiveResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (headerSearch.trim().length >= 2) {
      const delayDebounceFn = setTimeout(async () => {
        setIsSearching(true);
        try {
          const { data } = await productService.listProducts({ search: headerSearch });
          setLiveResults(data.slice(0, 5));
        } catch (err) {
          console.error("Live search failed", err);
        } finally {
          setIsSearching(false);
        }
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setLiveResults([]);
    }
  }, [headerSearch]);

  const isActive = (path: string) => {
    if (path === '/products' && location.pathname === '/products') return true;
    if (path !== '/products' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(headerSearch.trim())}`);
      setSearchOpen(false);
      setHeaderSearch('');
    }
  };

  return (
    <div className="min-h-screen bg-page-bg flex flex-col transition-colors duration-500 font-sans text-page-text">
      
      {/* Top Header Bar */}
      <div className="bg-shopstack-gray dark:bg-[#1a1a1a] py-2 hidden md:block">
        <div className="shopstack-container flex justify-between items-center text-xs">
          <div className="flex items-center space-x-6">
            <div className="group relative cursor-pointer flex items-center">
              <span>English</span>
              <ChevronDown size={12} className="ml-1" />
            </div>
            <div className="group relative cursor-pointer flex items-center">
              <span>USD</span>
              <ChevronDown size={12} className="ml-1" />
            </div>
            <div className="flex items-center">
              Call Us <span className="font-bold ml-1">3965410</span>
            </div>
          </div>
          <div>
            <p>Free delivery on order over <span className="text-shopstack-red font-bold">$200</span></p>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-page-bg shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="shopstack-container flex justify-between items-center text-page-text">
          
          {/* Logo */}
          <Link to="/products" className="text-2xl sm:text-3xl font-black tracking-tighter text-page-heading no-underline truncate pr-2">
            shopstack.
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            <Link to="/products" className={`text-sm font-medium uppercase tracking-wide hover:text-shopstack-red transition-colors no-underline ${isActive('/products') ? 'text-shopstack-red' : 'text-page-heading'}`}>
              Home
            </Link>
            <Link to="/products" className={`text-sm font-medium uppercase tracking-wide hover:text-shopstack-red transition-colors no-underline text-page-heading`}>
              Shop
            </Link>
            <Link to="/dashboard" className={`text-sm font-medium uppercase tracking-wide hover:text-shopstack-red transition-colors no-underline ${isActive('/dashboard') ? 'text-shopstack-red' : 'text-page-heading'}`}>
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin/users" className={`text-sm font-medium uppercase tracking-wide hover:text-shopstack-red transition-colors no-underline ${isActive('/admin/users') ? 'text-shopstack-red' : 'text-page-heading'}`}>
                Users
              </Link>
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <button onClick={toggleTheme} className="text-page-heading hover:text-shopstack-red transition-colors bg-transparent border-none cursor-pointer">
              {theme === 'light' ? <Moon size={22} strokeWidth={1.5} /> : <Sun size={22} strokeWidth={1.5} />}
            </button>
            <button 
              onClick={() => setSearchOpen(true)}
              className="text-page-heading hover:text-shopstack-red transition-colors bg-transparent border-none cursor-pointer"
            >
              <Search size={22} strokeWidth={1.5} />
            </button>
            
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-page-heading hover:text-shopstack-red transition-colors bg-transparent border-none cursor-pointer"
              >
                <User size={22} strokeWidth={1.5} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-page-bg shadow-xl border border-shopstack-border rounded-sm py-2 z-50">
                  <div className="px-4 py-2 border-b border-shopstack-border mb-2 text-page-text">
                    <p className="text-xs font-bold text-page-heading truncate">{user?.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-page-text hover:bg-shopstack-gray hover:text-shopstack-red no-underline">My Account</Link>
                  <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-page-text hover:bg-shopstack-gray hover:text-shopstack-red border-none bg-transparent cursor-pointer">Logout</button>
                </div>
              )}
            </div>
            
            <button className="text-page-heading hover:text-shopstack-red transition-colors hidden sm:block bg-transparent border-none cursor-pointer">
              <Heart size={22} strokeWidth={1.5} />
            </button>
            <Link to="/cart" className="text-page-heading hover:text-shopstack-red transition-colors relative bg-transparent border-none cursor-pointer">
              <ShoppingCart size={22} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-shopstack-dark dark:bg-white text-white dark:text-shopstack-dark w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-page-heading ml-2 bg-transparent border-none cursor-pointer"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <div className={`fixed inset-0 z-[100] bg-white dark:bg-[#111] transition-all duration-500 flex flex-col ${searchOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="p-6 flex justify-end">
          <button 
            onClick={() => setSearchOpen(false)}
            className="p-4 text-page-heading hover:text-shopstack-red transition-colors bg-transparent border-none cursor-pointer"
          >
            <X size={40} strokeWidth={1} />
          </button>
        </div>
        <div className="flex-grow flex flex-col items-center justify-center px-6 overflow-y-auto">
          <form onSubmit={handleHeaderSearch} className="w-full max-w-4xl relative mb-12">
            <input 
              autoFocus={searchOpen}
              type="text" 
              placeholder="Search for products..."
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="w-full bg-transparent border-b-2 border-shopstack-border dark:border-gray-800 py-6 text-4xl sm:text-6xl font-black text-page-heading focus:outline-none focus:border-shopstack-red transition-colors placeholder-gray-200 dark:placeholder-gray-800"
            />
            <button type="submit" className="absolute right-0 bottom-6 text-page-heading hover:text-shopstack-red transition-colors bg-transparent border-none cursor-pointer">
              {isSearching ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-shopstack-red"></div> : <Search size={40} strokeWidth={1.5} />}
            </button>
          </form>

          {/* Live Results List */}
          {liveResults.length > 0 && (
            <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
              {liveResults.map(p => (
                <Link 
                  key={p.id} 
                  to={`/products/${p.id}`} 
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-6 p-4 rounded-3xl hover:bg-shopstack-gray dark:hover:bg-[#222] transition-all no-underline group"
                >
                  <div className="w-20 h-20 bg-white dark:bg-black rounded-2xl overflow-hidden flex-shrink-0 border border-shopstack-border dark:border-gray-800">
                    {p.image_url ? (
                      <img src={`/api-proxy/product${p.image_url}`} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400 uppercase">{p.name.substring(0,2)}</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="text-[10px] font-black uppercase text-shopstack-red tracking-widest mb-1">{p.category}</p>
                    <h4 className="text-xl font-bold text-page-heading group-hover:text-shopstack-red transition-colors">{p.name}</h4>
                    <p className="text-lg font-black text-page-heading mt-1">${p.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          {headerSearch.trim().length >= 2 && liveResults.length === 0 && !isSearching && (
            <p className="text-xl font-bold text-gray-400">No products found for "{headerSearch}"</p>
          )}
        </div>
      </div>

      {/* Mobile Menu Sidebar */}
      <div className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)}>
        <div 
          className={`fixed inset-y-0 right-0 w-[85vw] max-w-[320px] bg-page-bg shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-shopstack-border dark:border-gray-800">
            <span className="font-black text-xl text-page-heading tracking-tighter">shopstack.</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-shopstack-red bg-transparent border-none cursor-pointer p-2 -mr-2"><X size={24} /></button>
          </div>
          
          {user && (
            <div className="p-6 border-b border-shopstack-border dark:border-gray-800 bg-shopstack-gray/50 dark:bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-shopstack-dark dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xl uppercase">
                  {user.username.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-page-heading truncate">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="p-6 flex flex-col space-y-4 flex-grow overflow-y-auto">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-page-heading hover:text-shopstack-red no-underline py-2 border-b border-transparent hover:border-shopstack-red/20 transition-all">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-page-heading hover:text-shopstack-red no-underline py-2 border-b border-transparent hover:border-shopstack-red/20 transition-all">Shop</Link>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-page-heading hover:text-shopstack-red no-underline py-2 border-b border-transparent hover:border-shopstack-red/20 transition-all">Dashboard</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="text-lg font-bold text-page-heading hover:text-shopstack-red no-underline py-2 border-b border-transparent hover:border-shopstack-red/20 transition-all">Users</Link>
            )}
          </nav>
          
          <div className="p-6 border-t border-shopstack-border dark:border-gray-800">
            {user ? (
              <button 
                onClick={() => { logout(); setMobileMenuOpen(false); }} 
                className="w-full py-4 bg-shopstack-gray dark:bg-[#222] text-page-heading font-bold uppercase tracking-wider text-sm hover:bg-shopstack-red hover:text-white transition-colors border-none rounded-sm"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-4 text-center border border-shopstack-border dark:border-gray-700 text-page-heading font-bold uppercase tracking-wider text-sm hover:border-shopstack-red hover:text-shopstack-red transition-colors no-underline rounded-sm">Login</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-4 text-center bg-shopstack-red text-white font-bold uppercase tracking-wider text-sm hover:bg-black transition-colors no-underline rounded-sm">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-shopstack-gray dark:bg-[#1a1a1a] pt-20 pb-10 mt-auto">
        <div className="shopstack-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-shopstack-border dark:border-gray-800 pb-16">
          <div>
            <Link to="/products" className="text-3xl font-black tracking-tighter text-shopstack-dark dark:text-white inline-block mb-6 no-underline">
              shopstack.
            </Link>
            <p className="mb-4 text-sm leading-relaxed">© 2026 shopstack.<br/>All Rights Reserved</p>
          </div>
          <div>
            <h4 className="text-base font-bold text-shopstack-dark dark:text-white uppercase mb-6">About Us</h4>
            <ul className="space-y-3 text-sm list-none p-0">
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">About us</Link></li>
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Store location</Link></li>
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Contact</Link></li>
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Orders tracking</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-bold text-shopstack-dark dark:text-white uppercase mb-6">Useful Links</h4>
            <ul className="space-y-3 text-sm list-none p-0">
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Returns</Link></li>
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Support Policy</Link></li>
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Size guide</Link></li>
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-bold text-shopstack-dark dark:text-white uppercase mb-6">Follow Us</h4>
            <ul className="space-y-3 text-sm list-none p-0">
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Facebook</Link></li>
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Twitter</Link></li>
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Instagram</Link></li>
              <li><Link to="#" className="hover:text-shopstack-red transition-colors no-underline text-inherit">Youtube</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
