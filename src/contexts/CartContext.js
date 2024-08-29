import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

// Create a context for the cart
const CartContext = createContext();

// Provider component for cart context
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);

      // Listen for real-time updates to the cart document
      const unsubscribe = onSnapshot(cartRef, (docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          // Filter out any potential empty items
          const cartItems = Object.values(data).filter(item => item && item.id);
          setCart(cartItems);
        } else {
          setCart([]);
        }
      });

      // Clean up the subscription on unmount
      return () => unsubscribe();
    } else {
      setCart([]);
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);
