import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../api/orderService';
import type { OrderRead } from '../types';
import { 
  ChevronRight, 
  Package, 
  ArrowRight,
  Layers,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<OrderRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await orderService.listOrders();
        setOrders(Array.isArray(data) ? data : (data ? [data] : []));
      } catch (err: any) {
        console.error("Failed to fetch orders", err);
        if (err.response?.status === 404) {
          // Gracefully handle missing backend endpoint
          setOrders([]);
          setError("Order synchronization service is currently unavailable. History records cannot be retrieved at this time.");
        } else {
          setError("System error during record synchronization.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return (
    <div className="flex-grow flex items-center justify-center bg-white dark:bg-black min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-shopstack-red border-t-transparent"></div>
    </div>
  );

  return (
    <div className="flex-grow bg-white dark:bg-black transition-colors duration-300 pb-24">
      <div className="shopstack-container py-12">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
          <Link to="/dashboard" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Profile</Link>
          <ChevronRight size={12} className="rotate-180" />
          <span>Order History</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 dark:border-neutral-900 pb-8 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">Order Archive</h1>
            <p className="text-neutral-500 text-sm font-medium">Synchronized transaction history for your account.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" placeholder="Search ID..." className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-lg pl-9 pr-4 py-2 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-shopstack-red/20 w-40 transition-all" />
            </div>
            <button className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-lg px-4 py-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-shopstack-red transition-all cursor-pointer">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-12 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-2xl flex items-center gap-4">
            <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0" size={24} />
            <p className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-tight leading-relaxed">
              {error}
            </p>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="py-32 text-center bg-neutral-50 dark:bg-neutral-950 rounded-3xl border border-neutral-100 dark:border-neutral-900">
            <Package size={48} className="mx-auto text-neutral-200 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-tighter mb-2">No active records</h3>
            <p className="text-neutral-500 text-sm font-medium mb-10 max-w-xs mx-auto">Your order history is currently empty or unavailable. Initialize a checkout sequence to see records here.</p>
            <Link to="/products" className="btn-primary !rounded-full !px-10 uppercase tracking-widest text-[10px] no-underline shadow-lg shadow-shopstack-red/20">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link 
                key={order.id} 
                to={`/dashboard/orders/${order.id}`}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl hover:shadow-xl hover:shadow-black/5 transition-all no-underline text-inherit group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-900 rounded-xl flex items-center justify-center group-hover:bg-shopstack-red group-hover:text-white transition-colors">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-1 group-hover:text-shopstack-red transition-colors">Order #{order.id.substring(0, 8)}</h4>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
                      {new Date(order.created_at).toLocaleDateString()} • {order.items.length} Units
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-12 mt-6 md:mt-0">
                  <div className="text-right">
                    <p className="text-sm font-black tracking-tight">Rs. {order.total_amount.toLocaleString()}</p>
                    <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${
                      order.status === 'PAID' ? 'text-emerald-500' : 
                      order.status === 'PENDING_PAYMENT' ? 'text-amber-500' : 'text-red-500'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-neutral-300 group-hover:text-shopstack-red group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;
