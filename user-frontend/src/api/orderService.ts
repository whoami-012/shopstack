import axios from 'axios';
import type { OrderRead, OrderCreate } from '../types';

const orderApi = axios.create({
  baseURL: '/api-proxy/order',
});

orderApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const orderService = {
  createOrder: (data: OrderCreate) => 
    orderApi.post<OrderRead>('/orders', data),
    
  // Added based on common patterns, though backend implementation might be incomplete
  listOrders: () => 
    orderApi.get<OrderRead[]>('/orders'),
    
  getOrder: (id: string) => 
    orderApi.get<OrderRead>(`/orders/${id}`),
};
