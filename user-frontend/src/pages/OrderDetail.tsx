import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { orderService } from '../api/orderService';
import type { OrderRead } from '../types';
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  Zap,
  Layers,
  AlertCircle
} from 'lucide-react';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<OrderRead | null>(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      // If we already have the order from state, don't fetch (since backend GET is missing)
      if (order || !id) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await orderService.getOrder(id);
        setOrder(data);
      } catch (err: any) {
        console.error("Failed to fetch order", err);
        if (err.response?.status === 404) {
            setError("Order retrieval service is currently unavailable. Your order was processed, but history cannot be viewed yet.");
        } else {
            setError("System synchronization error. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, order]);

  if (loading) return (
    <div className="flex-grow flex items-center justify-center bg-white dark:bg-black min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-shopstack-red border-t-transparent"></div>
    </div>
  );

  if (error || !order) return (
    <div className="flex-grow shopstack-container py-24 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-full mb-6">
        <AlertCircle size={32} className="text-red-500" />
      </div>
      <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter">Information</h2>
      <p className="text-neutral-500 mb-10 max-w-md mx-auto font-medium">{error || "The requested order record is not indexed."}</p>
      <Link to="/products" className="btn-primary !rounded-full no-underline uppercase tracking-widest text-[10px] px-10 shadow-lg shadow-shopstack-red/20">Return to Catalog</Link>
    </div>
  );

  return (
    <div className="flex-grow bg-white dark:bg-black transition-colors duration-300 pb-24">
      <div className="shopstack-container py-12">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-4">
          <Link to="/dashboard" className="hover:text-shopstack-red text-inherit no-underline transition-colors">Profile</Link>
          <ChevronLeft size={12} className="rotate-180" />
          <span>Order Details</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-100 dark:border-neutral-900 pb-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black tracking-tighter uppercase">Order Summary</h1>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                    order.status === 'PAID' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 
                    order.status === 'PENDING_PAYMENT' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                    {order.status.replace('_', ' ')}
                </div>
            </div>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">Transaction ID: {order.id}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Authorized: {new Date(order.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Order Items */}
          <div className="lg:col-span-8 space-y-10">
            <div className="space-y-6">
              <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                <Package size={20} className="text-shopstack-red" />
                Manifest
              </h2>
              
              <div className="divide-y divide-neutral-100 dark:divide-neutral-900 border-t border-neutral-100 dark:border-neutral-900">
                {order.items.map((item: any) => (
                  <div key={item.id} className="py-8 flex justify-between items-center group">
                    <div className="flex gap-6 items-center">
                      <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-950 rounded-xl flex items-center justify-center border border-neutral-100 dark:border-neutral-900">
                        <Layers size={24} className="text-neutral-300" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-black uppercase tracking-tight group-hover:text-shopstack-red transition-colors">{item.product_name}</h3>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black tracking-tight">Rs. {item.subtotal.toLocaleString()}</p>
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-tighter">Rs. {item.price.toLocaleString()} / Unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tracking/Status Visualization */}
            <div className="bg-neutral-50 dark:bg-neutral-950 rounded-3xl p-10 border border-neutral-100 dark:border-neutral-900">
              <h2 className="text-sm font-black uppercase tracking-widest mb-10 flex items-center gap-3">
                <Truck size={18} className="text-shopstack-red" />
                Logistics Status
              </h2>
              
              <div className="relative flex justify-between">
                {/* Connector line */}
                <div className="absolute top-5 left-0 w-full h-0.5 bg-neutral-200 dark:bg-neutral-800 -z-0" />
                
                {[
                  { label: 'Authorization', icon: ShieldCheck, active: true },
                  { label: 'Provisioning', icon: Zap, active: order.status === 'PAID' },
                  { label: 'Transit', icon: Truck, active: false },
                  { label: 'Finalized', icon: CheckCircle2, active: false }
                ].map((step, i) => (
                  <div key={i} className="relative z-10 flex flex-col items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step.active ? 'bg-shopstack-red text-white shadow-lg shadow-shopstack-red/30 scale-110' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400'}`}>
                      <step.icon size={18} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-tighter ${step.active ? 'text-shopstack-red' : 'text-neutral-400'}`}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Totals & Security */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-neutral-50 dark:bg-neutral-950 p-10 rounded-3xl border border-neutral-100 dark:border-neutral-900 space-y-8 shadow-sm">
              <h2 className="text-xl font-black uppercase tracking-tighter">Finalization</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  <span>Gross Total</span>
                  <span className="text-shopstack-black dark:text-white">Rs. {order.total_amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  <span>Logistics</span>
                  <span className="text-emerald-500">Subsidized</span>
                </div>
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest">Total Paid</span>
                  <span className="text-2xl font-black tracking-tighter">Rs. {order.total_amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0" />
                <p className="text-[9px] text-emerald-700 dark:text-emerald-400 font-black uppercase leading-relaxed tracking-tight">
                  Transaction verified under Secure Protocol. All systems nominal.
                </p>
              </div>
            </div>

            <div className="p-8 border border-neutral-100 dark:border-neutral-900 rounded-3xl space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} className="text-shopstack-red" />
                Logistics Note
              </h3>
              <p className="text-[11px] text-neutral-500 font-medium leading-relaxed uppercase tracking-tighter">
                Orders are usually provisioned within 2-4 hours. You will receive a secure notification once logistics transit commences.
              </p>
              <button className="w-full py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[10px] font-black uppercase tracking-widest hover:border-shopstack-red hover:text-shopstack-red transition-all cursor-not-allowed opacity-50">
                Download Invoice (Coming Soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
