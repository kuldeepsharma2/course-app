import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);

      const unsubscribe = onSnapshot(cartRef, (docSnapshot) => {
        const data = docSnapshot.data();
        if (data) {
          const cartItems = Object.values(data).filter(item => item && item.id);
          setCart(cartItems);
        } else {
          setCart([]);
        }
      });

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

export const useCart = () => useContext(CartContext);
