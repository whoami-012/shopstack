import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link, useLocation, Outlet } from 'react-router-dom';
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
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/products' && location.pathname === '/products') return true;
    if (path !== '/products' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-page-bg flex flex-col transition-colors duration-500 font-sans text-page-text">
      
      {/* Top Header Bar */}
      <div className="bg-flone-gray dark:bg-[#1a1a1a] py-2 hidden md:block">
        <div className="flone-container flex justify-between items-center text-xs">
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
            <p>Free delivery on order over <span className="text-flone-red font-bold">$200</span></p>
          </div>
        </div>
      </div>

      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-page-bg shadow-md py-4' : 'bg-transparent py-6'}`}>
        <div className="flone-container flex justify-between items-center text-page-text">
          
          {/* Logo */}
          <Link to="/products" className="text-3xl font-black tracking-tighter text-page-heading">
            FLONE.
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            <Link to="/products" className={`text-sm font-medium uppercase tracking-wide hover:text-flone-red transition-colors ${isActive('/products') ? 'text-flone-red' : 'text-page-heading'}`}>
              Home
            </Link>
            <Link to="/products" className={`text-sm font-medium uppercase tracking-wide hover:text-flone-red transition-colors text-page-heading`}>
              Shop
            </Link>
            <Link to="/dashboard" className={`text-sm font-medium uppercase tracking-wide hover:text-flone-red transition-colors ${isActive('/dashboard') ? 'text-flone-red' : 'text-page-heading'}`}>
              Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin/users" className={`text-sm font-medium uppercase tracking-wide hover:text-flone-red transition-colors ${isActive('/admin/users') ? 'text-flone-red' : 'text-page-heading'}`}>
                Users
              </Link>
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-5 sm:space-x-6">
            <button onClick={toggleTheme} className="text-page-heading hover:text-flone-red transition-colors">
              {theme === 'light' ? <Moon size={22} strokeWidth={1.5} /> : <Sun size={22} strokeWidth={1.5} />}
            </button>
            <button className="text-page-heading hover:text-flone-red transition-colors">
              <Search size={22} strokeWidth={1.5} />
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="text-page-heading hover:text-flone-red transition-colors"
              >
                <User size={22} strokeWidth={1.5} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-page-bg shadow-xl border border-flone-border rounded-sm py-2 z-50">
                  <div className="px-4 py-2 border-b border-flone-border mb-2 text-page-text">
                    <p className="text-xs font-bold text-page-heading truncate">{user?.username}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-page-text hover:bg-flone-gray hover:text-flone-red">My Account</Link>
                  <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-page-text hover:bg-flone-gray hover:text-flone-red border-none bg-transparent">Logout</button>
                </div>
              )}
            </div>
            
            <button className="text-page-heading hover:text-flone-red transition-colors hidden sm:block">
              <Heart size={22} strokeWidth={1.5} />
            </button>
            <button className="text-page-heading hover:text-flone-red transition-colors relative">
              <ShoppingCart size={22} strokeWidth={1.5} />
              <span className="absolute -top-2 -right-2 bg-flone-dark dark:bg-white text-white dark:text-flone-dark w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">0</span>
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden text-page-heading ml-2 bg-transparent border-none"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <div className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 lg:hidden ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMobileMenuOpen(false)}>
        <div 
          className={`fixed inset-y-0 right-0 w-[300px] bg-page-bg shadow-2xl transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-flone-border">
            <span className="font-bold text-lg text-page-heading">MENU</span>
            <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-flone-red bg-transparent border-none"><X size={24} /></button>
          </div>
          <nav className="p-6 flex flex-col space-y-6">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-page-heading hover:text-flone-red">Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-page-heading hover:text-flone-red">Shop</Link>
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-page-heading hover:text-flone-red">Dashboard</Link>
            {user?.role === 'admin' && (
              <Link to="/admin/users" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium text-page-heading hover:text-flone-red">Users</Link>
            )}
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-flone-gray dark:bg-[#1a1a1a] pt-20 pb-10 mt-auto">
        <div className="flone-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-flone-border dark:border-gray-800 pb-16">
          <div>
            <Link to="/products" className="text-3xl font-black tracking-tighter text-flone-dark dark:text-white inline-block mb-6">
              FLONE.
            </Link>
            <p className="mb-4 text-sm leading-relaxed">© 2026 Flone.<br/>All Rights Reserved</p>
          </div>
          <div>
            <h4 className="text-base font-bold text-flone-dark dark:text-white uppercase mb-6">About Us</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-flone-red transition-colors">About us</Link></li>
              <li><Link to="#" className="hover:text-flone-red transition-colors">Store location</Link></li>
              <li><Link to="#" className="hover:text-flone-red transition-colors">Contact</Link></li>
              <li><Link to="#" className="hover:text-flone-red transition-colors">Orders tracking</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-bold text-flone-dark dark:text-white uppercase mb-6">Useful Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-flone-red transition-colors">Returns</Link></li>
              <li><Link to="#" className="hover:text-flone-red transition-colors">Support Policy</Link></li>
              <li><Link to="#" className="hover:text-flone-red transition-colors">Size guide</Link></li>
              <li><Link to="#" className="hover:text-flone-red transition-colors">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-bold text-flone-dark dark:text-white uppercase mb-6">Follow Us</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="#" className="hover:text-flone-red transition-colors">Facebook</Link></li>
              <li><Link to="#" className="hover:text-flone-red transition-colors">Twitter</Link></li>
              <li><Link to="#" className="hover:text-flone-red transition-colors">Instagram</Link></li>
              <li><Link to="#" className="hover:text-flone-red transition-colors">Youtube</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
