import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Layers, Zap, Truck, Shield } from 'lucide-react';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ username, email, password, role });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Provisioning failed. Attempt restart.');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-black transition-colors duration-300">
      
      {/* Left Side - Register Form */}
      <div className="flex-grow flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 bg-white dark:bg-black order-2 md:order-1">
        <div className="w-full max-w-sm">
          <Link to="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-shopstack-red mb-16 no-underline group transition-colors">
            <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return to Login
          </Link>

          <div className="mb-12">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-3 text-shopstack-red">Registration</h2>
            <p className="text-sm text-neutral-500 font-medium">Create a new account to access the global network.</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-black uppercase tracking-widest leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Username</label>
              <input
                type="text"
                required
                className="shopstack-input"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

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
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Password</label>
              <input
                type="password"
                required
                className="shopstack-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-3 rounded-lg border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    role === 'user' 
                      ? 'bg-shopstack-red border-shopstack-red text-white shadow-lg shadow-shopstack-red/20' 
                      : 'bg-transparent border-neutral-100 dark:border-neutral-800 text-neutral-500 hover:border-shopstack-red hover:text-shopstack-red'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('seller')}
                  className={`py-3 rounded-lg border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    role === 'seller' 
                      ? 'bg-shopstack-red border-shopstack-red text-white shadow-lg shadow-shopstack-red/20' 
                      : 'bg-transparent border-neutral-100 dark:border-neutral-800 text-neutral-500 hover:border-shopstack-red hover:text-shopstack-red'
                  }`}
                >
                  Seller
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="btn-primary !w-full !rounded-xl !py-5 flex justify-between items-center px-10 group shadow-2xl shadow-shopstack-red/30 uppercase tracking-[0.2em] text-xs"
              >
                <span>Join Now</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <p className="mt-16 text-center text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Already registered?{' '}
            <Link to="/login" className="text-shopstack-red hover:underline transition-colors no-underline ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Features/Branding */}
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-shopstack-black relative items-center justify-center p-12 overflow-hidden order-1 md:order-2 border-l border-neutral-900">
         <div className="relative z-10 text-white space-y-16 max-w-sm">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-shopstack-red rounded-lg flex items-center justify-center shadow-lg shadow-shopstack-red/20">
               <Layers size={22} fill="currentColor" />
             </div>
             <span className="text-xl font-black tracking-tighter uppercase">Rewards</span>
           </div>

           <h2 className="text-4xl font-black tracking-tighter uppercase leading-[0.9]">
             Elevate your <br />shopping <br /><span className="text-shopstack-red">Experience.</span>
           </h2>
           
           <div className="space-y-10">
             <div className="flex gap-5 group">
               <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0 group-hover:bg-shopstack-red transition-colors duration-500">
                 <Zap size={20} className="text-white" />
               </div>
               <div>
                 <h3 className="font-black text-xs uppercase tracking-widest mb-2 group-hover:text-shopstack-red transition-colors">Priority Access</h3>
                 <p className="text-xs text-neutral-400 font-medium leading-relaxed">Get first-tier access to limited drops and exclusive inventory releases.</p>
               </div>
             </div>
             
             <div className="flex gap-5 group">
               <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0 group-hover:bg-shopstack-red transition-colors duration-500">
                 <Truck size={20} className="text-white" />
               </div>
               <div>
                 <h3 className="font-black text-xs uppercase tracking-widest mb-2 group-hover:text-shopstack-red transition-colors">Global Logistics</h3>
                 <p className="text-xs text-neutral-400 font-medium leading-relaxed">Free international express shipping on all orders over the minimum threshold.</p>
               </div>
             </div>

             <div className="flex gap-5 group">
               <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0 group-hover:bg-shopstack-red transition-colors duration-500">
                 <Shield size={20} className="text-white" />
               </div>
               <div>
                 <h3 className="font-black text-xs uppercase tracking-widest mb-2 group-hover:text-shopstack-red transition-colors">Secure Checkout</h3>
                 <p className="text-xs text-neutral-400 font-medium leading-relaxed">Advanced protection for all transactions and account management.</p>
               </div>
             </div>
           </div>
         </div>

         {/* Tech-inspired background circle */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-neutral-900 rounded-full pointer-events-none opacity-20" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-neutral-900 rounded-full pointer-events-none opacity-40" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-neutral-900 rounded-full pointer-events-none opacity-60" />
      </div>
    </div>
  );
};

export default Register;
