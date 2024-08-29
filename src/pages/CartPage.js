import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const cartDoc = await getDoc(doc(db, 'carts', user.uid));
          if (cartDoc.exists()) {
            const cartData = cartDoc.data();
            const items = Object.values(cartData).filter(item => item && item.id); // Ensure no empty items
            setCartItems(items);

            const total = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
            setTotalAmount(total);
          }
        } catch (error) {
          console.error('Error fetching cart items:', error);
        }
      };

      fetchCartItems();
    }
  }, [user]);

  const handleRemoveFromCart = async (itemId) => {
    if (user) {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        await updateDoc(cartRef, {
          [itemId]: arrayRemove() // Correctly remove the item
        });
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        const updatedCartDoc = await getDoc(cartRef);
        const updatedCartData = updatedCartDoc.data();
        const updatedItems = Object.values(updatedCartData || {}).filter(item => item && item.id);
        const total = updatedItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
        setCartItems(updatedItems);
        setTotalAmount(total);
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Logic to handle the checkout process
    alert('Proceeding to checkout!');
  };

  if (!user) {
    return <p>Please log in to view your cart.</p>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartItems.length > 0 ? (
        <div className="flex flex-wrap -mx-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg mb-4 p-4 mx-4">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:w-1/3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-md"
                  />
                )}
              </div>
              <div className="flex-1 sm:ml-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="mb-2">{item.description}</p>
                <p className="text-gray-500 mb-2">Price: ${item.price}</p>
                <p className="text-gray-500 mb-4">Quantity: {item.quantity}</p>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition mr-2"
                >
                  Remove from Cart
                      </button>
                      <button
              onClick={handleBuyNow}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Buy Now
            </button>
              </div>
            </div>
          ))}
          <div className="justify-between items-center mt-4">
            <h2 className="text-xl font-bold">Total Amount: ${totalAmount}</h2>
            
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}

export default CartPage;
