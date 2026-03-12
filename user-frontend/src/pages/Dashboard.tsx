import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Package, Settings, ShoppingCart, Heart, MapPin, CreditCard, ChevronRight, Zap, ShieldCheck, List, PlusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const isSellerOrAdmin = user.role === 'seller' || user.role === 'admin';

  return (
    <div className="flex-grow bg-white dark:bg-black pb-20 transition-colors duration-300">
      
      {/* Header Area */}
      <div className="shopstack-container py-12 border-b border-neutral-100 dark:border-neutral-900">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
          <Link to="/products" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span>My Profile</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
          Hej {user.username.split(' ')[0]}!
        </h1>
        <p className="text-neutral-500 mt-3 text-sm font-medium">Welcome to your ShopStack account dashboard.</p>
      </div>

      <div className="shopstack-container mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-3">
            <nav className="flex flex-col space-y-1">
              <Link to="/dashboard" className="flex items-center space-x-3 px-5 py-3.5 bg-shopstack-red text-white font-bold rounded-lg no-underline shadow-lg shadow-shopstack-red/20 transition-transform active:scale-95">
                <User size={18} />
                <span className="text-[13px] uppercase tracking-wider">Overview</span>
              </Link>
              <Link to="/dashboard/orders" className="flex items-center space-x-3 px-5 py-3.5 text-shopstack-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 font-bold rounded-lg no-underline transition-all group">
                <ShoppingCart size={18} className="text-neutral-400 group-hover:text-shopstack-red transition-colors" />
                <span className="text-[13px] uppercase tracking-wider">Orders</span>
              </Link>
              {isSellerOrAdmin && (
                <Link to="/dashboard/inventory" className="flex items-center space-x-3 px-5 py-3.5 text-shopstack-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 font-bold rounded-lg no-underline transition-all group">
                  <List size={18} className="text-neutral-400 group-hover:text-shopstack-red transition-colors" />
                  <span className="text-[13px] uppercase tracking-wider">Inventory</span>
                </Link>
              )}
              <Link to="#" className="flex items-center space-x-3 px-5 py-3.5 text-shopstack-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 font-bold rounded-lg no-underline transition-all group">
                <Heart size={18} className="text-neutral-400 group-hover:text-shopstack-red transition-colors" />
                <span className="text-[13px] uppercase tracking-wider">Wishlist</span>
              </Link>
              <Link to="#" className="flex items-center space-x-3 px-5 py-3.5 text-shopstack-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 font-bold rounded-lg no-underline transition-all group">
                <MapPin size={18} className="text-neutral-400 group-hover:text-shopstack-red transition-colors" />
                <span className="text-[13px] uppercase tracking-wider">Addresses</span>
              </Link>
              <Link to="#" className="flex items-center space-x-3 px-5 py-3.5 text-shopstack-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 font-bold rounded-lg no-underline transition-all group">
                <CreditCard size={18} className="text-neutral-400 group-hover:text-shopstack-red transition-colors" />
                <span className="text-[13px] uppercase tracking-wider">Payments</span>
              </Link>
              <div className="pt-8">
                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center space-x-3 px-5 py-3.5 text-neutral-400 hover:text-red-500 font-bold rounded-lg transition-colors bg-transparent border-none cursor-pointer text-left"
                >
                  <span className="text-[11px] uppercase tracking-widest">Sign Out</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-12">
            
            {/* Account Status Card */}
            <div className="bg-shopstack-bg-gray dark:bg-neutral-950 p-8 md:p-10 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-8 border border-neutral-100 dark:border-neutral-900 shadow-sm transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white dark:bg-neutral-900 rounded-2xl flex items-center justify-center shadow-sm">
                  <ShieldCheck size={32} className="text-shopstack-red" />
                </div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase">Account Security</h2>
                  <p className="text-sm text-neutral-500 font-medium">Your Account ID is {user.is_active ? 'verified and secure' : 'pending verification'}.</p>
                </div>
              </div>
              <div className={`px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-sm ${user.is_active ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {user.is_active ? 'Verified' : 'Action Required'}
              </div>
            </div>

            {/* Quick Actions Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Seller Hub Card */}
              {isSellerOrAdmin && (
                <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-8 rounded-2xl hover:shadow-2xl hover:shadow-shopstack-red/5 transition-all group flex flex-col">
                  <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 text-amber-600 rounded-xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-black mb-4 tracking-tight uppercase group-hover:text-amber-600 transition-colors">Seller Hub</h3>
                  <p className="text-neutral-500 text-sm font-medium mb-8 flex-grow leading-relaxed">
                    Manage your product inventory, track sales performance, and update your listings.
                  </p>
                  <div className="flex gap-4">
                    <Link to="/dashboard/inventory" className="btn-primary !bg-amber-600 hover:!bg-amber-700 !py-2.5 !text-[11px] !px-6 !rounded-lg uppercase tracking-widest no-underline shadow-lg shadow-amber-600/20">
                      Manage Products
                    </Link>
                    <Link to="/products/add" className="btn-secondary !bg-white dark:!bg-transparent !text-shopstack-black dark:!text-white !border !border-neutral-200 dark:!border-neutral-800 !py-2.5 !text-[11px] !px-6 !rounded-lg uppercase tracking-widest hover:!border-amber-600 hover:!text-amber-600 no-underline transition-all">
                      <PlusCircle size={14} className="mr-2" /> Add New
                    </Link>
                  </div>
                </div>
              )}

              {/* Shopping Card */}
              <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-8 rounded-2xl hover:shadow-2xl hover:shadow-shopstack-red/5 transition-all group flex flex-col">
                <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-shopstack-red rounded-xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
                  <Package size={24} />
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tight uppercase group-hover:text-shopstack-red transition-colors">Explore Collections</h3>
                <p className="text-neutral-500 text-sm font-medium mb-8 flex-grow leading-relaxed">
                  Discover thousands of premium products curated for your modern lifestyle.
                </p>
                <div className="flex gap-4">
                  <Link to="/products" className="btn-primary !py-2.5 !text-[11px] !px-6 !rounded-lg uppercase tracking-widest no-underline shadow-lg shadow-shopstack-red/20">
                    Browse Now
                  </Link>
                </div>
              </div>

              {/* Management Card */}
              {user.role === 'admin' && (
                <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-8 rounded-2xl hover:shadow-2xl hover:shadow-shopstack-red/5 transition-all group flex flex-col">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded-xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110">
                    <Settings size={24} />
                  </div>
                  <h3 className="text-xl font-black mb-4 tracking-tight uppercase group-hover:text-shopstack-red transition-colors">System Control</h3>
                  <p className="text-neutral-500 text-sm font-medium mb-8 flex-grow leading-relaxed">
                    Advanced management tools for users, permissions, and platform settings.
                  </p>
                  <Link to="/admin/users" className="btn-secondary !py-2.5 !text-[11px] !px-6 !rounded-lg uppercase tracking-widest no-underline shadow-lg shadow-black/10 dark:shadow-none transition-all">
                    Admin Panel
                  </Link>
                </div>
              )}
            </div>

            {/* Prime Banner */}
            {!isSellerOrAdmin && (
              <div className="relative rounded-2xl overflow-hidden h-[340px] flex items-center p-12 group border border-neutral-100 dark:border-neutral-900 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" 
                  alt="Modern Store" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                <div className="relative z-10 text-white max-w-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Zap size={20} className="text-shopstack-red fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusive Access</span>
                  </div>
                  <h3 className="text-3xl font-black mb-4 !text-white leading-tight uppercase tracking-tighter">ShopStack Prime</h3>
                  <p className="text-sm font-medium mb-8 opacity-90 !text-white leading-relaxed">Early access to new drops and unlimited free priority shipping.</p>
                  <button className="bg-white text-shopstack-black px-8 py-3 rounded-lg font-black text-[11px] uppercase tracking-widest hover:bg-shopstack-red hover:text-white transition-all active:scale-95 shadow-xl shadow-black/20">Upgrade Now</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
