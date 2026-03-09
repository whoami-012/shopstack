import axios from 'axios';
import type { CartRead, CartItemRead, CartItemCreate, CartItemQuantityUpdate } from '../types';

const cartApi = axios.create({
  baseURL: '/api-proxy/cart',
});

cartApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const cartService = {
  getCart: () => cartApi.get<CartRead>('/cart/items'),
  
  addItem: (data: CartItemCreate) => 
    cartApi.post<CartItemRead>('/cart/items', data),
    
  updateItemQuantity: (data: CartItemQuantityUpdate) => 
    cartApi.put<CartItemRead>('/cart/items', data),
};
