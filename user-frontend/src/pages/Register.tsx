import { useState } from 'react';
import { userService } from '../api/userService';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Briefcase, ArrowRight } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await userService.register(formData);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-page-bg transition-colors duration-500 p-4 py-12 text-page-text">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-[480px]">
        <div className="bg-page-bg/70 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl border border-shopstack-border transition-all duration-500">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-cyan-600 dark:bg-cyan-500 text-white mb-6 shadow-xl shadow-cyan-200 dark:shadow-cyan-900/40 -rotate-3 transform hover:rotate-0 transition-transform duration-300">
              <UserPlus size={36} />
            </div>
            <h2 className="text-3xl font-black text-page-heading tracking-tight mb-2 tracking-tighter">Create Account</h2>
            <p className="text-page-text font-medium tracking-wide uppercase text-[10px] tracking-widest">Join the nexus ecosystem today</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-2xl text-sm font-bold flex items-center shadow-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-page-text ml-1 uppercase tracking-widest text-[10px]">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-page-text placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-page-text ml-1 uppercase tracking-widest text-[10px]">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-page-text placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-page-text ml-1 uppercase tracking-widest text-[10px]">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-page-text placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-page-text ml-1 uppercase tracking-widest text-[10px]">Account Type</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-500 transition-colors">
                  <Briefcase size={18} />
                </div>
                <select
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-page-text focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition-all duration-300 appearance-none cursor-pointer"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="user">Customer Account</option>
                  <option value="seller">Seller Account</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="group mt-6 w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl shadow-xl text-base font-black text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-cyan-200 dark:shadow-none mt-4 cursor-pointer"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-page-text font-medium">
            Already a member?{' '}
            <Link to="/login" className="text-cyan-600 dark:text-cyan-400 hover:underline font-black transition-colors no-underline">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
