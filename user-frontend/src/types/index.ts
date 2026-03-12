export interface UserRead {
  id: string;
  username: string;
  email: string;
  is_active: boolean;
  role: 'user' | 'seller' | 'admin';
  created_at?: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface AdminUserUpdate {
  username?: string;
  email?: string;
  role?: string;
  is_active?: boolean;
}

// Product Types
export interface ProductRead {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  description: string;
  image_url?: string;
  created_at?: string;
}

export interface ProductCreate {
  name: string;
  category: string;
  stock: number;
  price: number;
  description: string;
  image_url: string;
}

export interface ProductUpdate {
  name?: string;
  category?: string;
  stock?: number;
  price?: number;
  description?: string;
  image_url?: string;
}

// Cart Types
export interface CartItemRead {
  id: string;
  cart_id: string;
  product_id: string;
  name?: string;
  quantity: number;
}

export interface CartRead {
  id: string | null;
  user_id: string;
  items: CartItemRead[];
}

export interface CartItemCreate {
  product_id: string;
  name?: string;
  quantity: number;
}

export interface CartItemQuantityUpdate {
  product_id: string;
  quantity: number;
}

// Order Types
export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface OrderItemCreate {
  product_id: string;
  quantity: number;
}

export interface OrderCreate {
  items: OrderItemCreate[];
}

export interface OrderItemRead {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface OrderRead {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: OrderItemRead[];
}
