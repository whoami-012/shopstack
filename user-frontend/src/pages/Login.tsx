import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Layers, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Authentication failed. Verify credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-black transition-colors duration-300">
      
      {/* Left Side - ShopStack Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-neutral-950 relative items-center justify-center p-12 overflow-hidden border-r border-neutral-900">
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200" 
          alt="ShopStack Warehouse" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
        />
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-shopstack-red rounded-xl flex items-center justify-center text-white shadow-2xl shadow-shopstack-red/40">
              <Layers size={28} fill="currentColor" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase">
              ShopStack
            </span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8 leading-[0.9] text-white uppercase">
            Access the <br />Global <br /><span className="text-shopstack-red">Inventory.</span>
          </h1>
          <p className="text-lg font-medium text-neutral-400 max-w-md leading-relaxed">
            The professional retail interface for the modern digital era. Real-time updates, secure transactions, and priority logistics.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-shopstack-red/5 to-transparent pointer-events-none" />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-grow flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-white dark:bg-black">
        <div className="w-full max-w-sm">
          <Link to="/products" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-shopstack-red mb-16 no-underline group transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Exit to Catalog
          </Link>

          <div className="mb-12">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-3">Authorization</h2>
            <p className="text-sm text-neutral-500 font-medium">Enter your credentials to log in.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-widest leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Email Address</label>
              <input
                type="email"
                required
                className="shopstack-input"
                placeholder="email@address.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Password</label>
                <button type="button" className="text-[10px] font-black text-shopstack-red hover:underline bg-transparent border-none cursor-pointer uppercase tracking-widest">Reset?</button>
              </div>
              <input
                type="password"
                required
                className="shopstack-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="btn-primary !w-full !rounded-xl !py-5 flex justify-between items-center px-10 group shadow-2xl shadow-shopstack-red/30 uppercase tracking-[0.2em] text-xs"
              >
                <span>Sign In</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <div className="mt-20 pt-10 border-t border-neutral-100 dark:border-neutral-900">
            <div className="flex items-center gap-3 mb-6 p-4 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
              <ShieldCheck size={20} className="text-shopstack-red" />
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 leading-tight">Secure Connection Enabled</p>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">No Account?</h3>
            <p className="text-[11px] text-neutral-500 font-medium mb-8 leading-relaxed">
              New users must register with the ShopStack network to access prime inventory and priority logistics.
            </p>
            <Link to="/register" className="btn-secondary !bg-white dark:!bg-transparent !text-shopstack-black dark:!text-white !border !border-neutral-200 dark:!border-neutral-800 !w-full no-underline text-center !py-4 !text-[10px] uppercase tracking-[0.2em] hover:!border-shopstack-red hover:!text-shopstack-red transition-all">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
