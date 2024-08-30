import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const cartRef = doc(db, 'carts', currentUser.uid);
        const enrolledCoursesRef = doc(db, 'students', currentUser.uid);

        const unsubscribeCart = onSnapshot(cartRef, async (cartSnapshot) => {
          const cartData = cartSnapshot.data();
          if (cartData) {
            const cartItems = Object.values(cartData).filter(item => item && item.id);

            // Fetch enrolled courses
            const enrolledCoursesDoc = await getDoc(enrolledCoursesRef);
            const enrolledCoursesData = enrolledCoursesDoc.exists() ? enrolledCoursesDoc.data().courses || [] : [];
            const enrolledCourseIds = new Set(enrolledCoursesData.map(course => course.id));

            // Filter out enrolled courses from cart
            const filteredItems = cartItems.filter(item => !enrolledCourseIds.has(item.id));

            setCart(filteredItems);
          } else {
            setCart([]);
          }
        });

        return () => unsubscribeCart();
      } else {
        setCart([]);
      }
    });

    return () => unsubscribeAuth();
  }, [auth]);

  const addItemToCart = async (item) => {
    const user = auth.currentUser;

    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      const cartDoc = await getDoc(cartRef);
      const cartData = cartDoc.data();

      let newCart = [];
      let updatedItem = { ...item, timestamp: new Date().toISOString() };

      if (cartData) {
        newCart = Object.values(cartData);
        const existingItemIndex = newCart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex > -1) {
          // Update the existing item's quantity and total amount
          newCart[existingItemIndex].quantity += item.quantity;
          newCart[existingItemIndex].totalAmount = newCart[existingItemIndex].quantity * item.price;
          newCart[existingItemIndex].timestamp = updatedItem.timestamp; // Update timestamp
        } else {
          // Add the item as a new entry
          newCart.push({ ...updatedItem, totalAmount: item.quantity * item.price });
        }
      } else {
        // If no items in the cart, add the first item
        newCart = [{ ...updatedItem, totalAmount: item.quantity * item.price }];
      }

      // Create a structured object to store in Firestore
      const cartObject = newCart.reduce((acc, cartItem, index) => {
        acc[`item_${index}`] = cartItem;
        return acc;
      }, {});

      // Update the Firestore document with the new cart
      await updateDoc(cartRef, cartObject);
    }
  };

  const clearCart = async () => {
    const user = auth.currentUser;

    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      await updateDoc(cartRef, {});
      setCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addItemToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
