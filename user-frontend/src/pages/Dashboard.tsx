import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, Package, Settings, ShoppingCart, Heart, MapPin, CreditCard } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="flex-grow bg-page-bg transition-colors duration-500 pb-20">
      
      {/* Breadcrumb Area */}
      <div className="bg-flone-gray dark:bg-[#1a1a1a] py-12 mb-16 text-center transition-colors">
        <h1 className="text-3xl font-bold text-page-heading uppercase tracking-wider mb-2">My Account</h1>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Link to="/products" className="hover:text-flone-red transition-colors text-inherit no-underline">Home</Link>
          <span>/</span>
          <span className="text-flone-red">My Account</span>
        </div>
      </div>

      <div className="flone-container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-flone-gray dark:bg-[#1a1a1a] p-6 rounded-sm transition-colors">
              <div className="mb-8 text-center pb-6 border-b border-flone-border dark:border-gray-800">
                <div className="w-20 h-20 bg-flone-dark dark:bg-white text-white dark:text-flone-dark rounded-full mx-auto flex items-center justify-center text-2xl font-bold mb-4 shadow-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-lg text-page-heading">{user.username}</h3>
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
              
              <ul className="space-y-2 p-0 m-0 list-none">
                <li>
                  <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 text-flone-red font-medium border-l-2 border-flone-red bg-white dark:bg-[#222] no-underline">
                    <User size={18} />
                    <span>Dashboard</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 px-4 py-3 text-page-text hover:text-flone-red transition-colors no-underline">
                    <ShoppingCart size={18} />
                    <span>Orders</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 px-4 py-3 text-page-text hover:text-flone-red transition-colors no-underline">
                    <Heart size={18} />
                    <span>Wishlist</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 px-4 py-3 text-page-text hover:text-flone-red transition-colors no-underline">
                    <MapPin size={18} />
                    <span>Addresses</span>
                  </Link>
                </li>
                <li>
                  <Link to="#" className="flex items-center space-x-3 px-4 py-3 text-page-text hover:text-flone-red transition-colors no-underline">
                    <CreditCard size={18} />
                    <span>Payment Methods</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Welcome text */}
            <div className="bg-white dark:bg-[#1a1a1a] border border-flone-border dark:border-gray-800 p-8 rounded-sm transition-colors">
              <p className="text-page-text leading-relaxed mb-6">
                Hello <span className="font-bold text-page-heading">{user.username}</span> (not {user.username}? <span className="text-flone-red cursor-pointer hover:underline font-bold">Log out</span>)
                <br/><br/>
                From your account dashboard. you can easily check & view your recent orders, manage your shipping and billing addresses and edit your password and account details.
              </p>

              {/* Status Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-flone-gray dark:bg-[#222] border border-flone-border dark:border-gray-800 rounded-sm">
                <span className="mr-2 text-sm text-gray-500">Account Status:</span>
                <span className={`flex items-center text-sm font-bold ${user.is_active ? 'text-green-600' : 'text-flone-red'}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${user.is_active ? 'bg-green-600' : 'bg-flone-red'}`}></span>
                  {user.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Quick Actions (Role based) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Product Management */}
              <div className="border border-flone-border dark:border-gray-800 p-8 rounded-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-4 mb-4">
                  <Package size={28} className="text-flone-red" />
                  <h3 className="text-xl font-bold text-page-heading">Store Catalog</h3>
                </div>
                <p className="text-gray-500 mb-6 h-12">Browse the current inventory or manage your products.</p>
                <div className="flex space-x-4">
                  <Link to="/products" className="flone-button !px-6 !py-2.5 no-underline">
                    Browse
                  </Link>
                  {(user.role === 'admin' || user.role === 'seller') && (
                    <Link to="/products/add" className="bg-transparent border border-page-heading text-page-heading px-6 py-2.5 hover:bg-flone-red hover:border-flone-red hover:text-white transition-all uppercase text-sm font-bold tracking-wider no-underline">
                      Add New
                    </Link>
                  )}
                </div>
              </div>

              {/* Admin Panel */}
              {user.role === 'admin' && (
                <div className="border border-flone-border dark:border-gray-800 p-8 rounded-sm hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <Settings size={28} className="text-flone-red" />
                    <h3 className="text-xl font-bold text-page-heading">Administration</h3>
                  </div>
                  <p className="text-gray-500 mb-6 h-12">Manage user accounts, roles, and system configurations.</p>
                  <Link to="/admin/users" className="flone-button !px-6 !py-2.5 no-underline font-bold">
                    Manage Users
                  </Link>
                </div>
              )}
              
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
