import axios from 'axios';
import type { ProductRead, ProductCreate } from '../types';

const productApi = axios.create({
  baseURL: '/api-proxy/product',
});

productApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productService = {
  listProducts: (params?: { search?: string; ids?: string[]; limit?: number; offset?: number }) => 
    productApi.get<ProductRead[]>('/products', { params }),
    
  getProduct: (id: string) => 
    productApi.get<ProductRead>(`/products/${id}`),
    
  createProduct: (data: ProductCreate) => 
    productApi.post<ProductRead>('/products', data),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return productApi.post<{ image_url: string }>('/products/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
