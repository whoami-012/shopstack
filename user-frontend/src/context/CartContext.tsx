import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartRead, CartItemCreate, CartItemQuantityUpdate } from '../types';
import { cartService } from '../api/cartService';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: CartRead | null;
  loading: boolean;
  isUpdating: boolean;
  addToCart: (item: CartItemCreate) => Promise<void>;
  updateQuantity: (update: CartItemQuantityUpdate) => Promise<void>;
  refreshCart: (showLoading?: boolean) => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartRead | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  const refreshCart = async (showLoading = false) => {
    if (!user) {
      setCart(null);
      return;
    }
    if (showLoading) setLoading(true);
    else setIsUpdating(true);
    
    try {
      const { data } = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
      setIsUpdating(false);
    }
  };

  const addToCart = async (item: CartItemCreate) => {
    try {
      await cartService.addItem(item);
      await refreshCart(false);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (update: CartItemQuantityUpdate) => {
    try {
      await cartService.updateItemQuantity(update);
      await refreshCart(false);
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    }
  };

  useEffect(() => {
    refreshCart(true);
  }, [user]);

  const itemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, isUpdating, addToCart, updateQuantity, refreshCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
