import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) { console.error('Cart fetch error:', err); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    setCartLoading(true);
    try {
      const { data } = await api.post('/cart', { productId, quantity });
      setCart(data);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add' };
    } finally { setCartLoading(false); }
  };

  const updateItem = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${productId}`, { quantity });
      setCart(data);
    } catch (err) { console.error(err); }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/${productId}`);
      setCart(data);
    } catch (err) { console.error(err); }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart/clear');
      setCart({ items: [] });
    } catch (err) { console.error(err); }
  };

  const cartCount = cart.items?.reduce((acc, i) => acc + i.quantity, 0) || 0;
  const cartTotal = cart.items?.reduce((acc, i) => {
    const price = i.product?.price || 0;
    return acc + price * i.quantity;
  }, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, cartCount, cartTotal, addToCart, updateItem, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
