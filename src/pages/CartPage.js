import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // Import useCart to use clearCart function
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();
  const { clearCart } = useCart(); // Get clearCart function from CartContext

  useEffect(() => {
    if (user) {
      const fetchCartItems = async () => {
        try {
          const cartDoc = await getDoc(doc(db, 'carts', user.uid));
          if (cartDoc.exists()) {
            const cartData = cartDoc.data();
            const items = Object.values(cartData).filter(item => item && item.id);

            // Fetch enrolled courses
            const enrolledCoursesRef = doc(db, 'students', user.uid);
            const enrolledCoursesDoc = await getDoc(enrolledCoursesRef);
            const enrolledCoursesData = enrolledCoursesDoc.exists() ? enrolledCoursesDoc.data().courses || [] : [];
            const enrolledCourseIds = new Set(enrolledCoursesData.map(course => course.id));

            // Filter out enrolled courses from cart
            const filteredItems = items.filter(item => !enrolledCourseIds.has(item.id));

            setCartItems(filteredItems);

            const total = filteredItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
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
          [itemId]: null
        });

        // Update cart state
        setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
        const updatedCartDoc = await getDoc(cartRef);
        const updatedCartData = updatedCartDoc.data();
        const updatedItems = Object.values(updatedCartData || {}).filter(item => item && item.id);

        // Fetch enrolled courses
        const enrolledCoursesRef = doc(db, 'students', user.uid);
        const enrolledCoursesDoc = await getDoc(enrolledCoursesRef);
        const enrolledCoursesData = enrolledCoursesDoc.exists() ? enrolledCoursesDoc.data().courses || [] : [];
        const enrolledCourseIds = new Set(enrolledCoursesData.map(course => course.id));

        // Filter out enrolled courses from cart
        const filteredItems = updatedItems.filter(item => !enrolledCourseIds.has(item.id));

        const total = filteredItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
        setCartItems(filteredItems);
        setTotalAmount(total);

        // Show toast notification for successful removal
        toast.success('Item removed from cart successfully');
      } catch (error) {
        console.error('Error removing item from cart:', error);
        // Show toast notification for error
        toast.error('Error removing item from cart');
      }
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const enrolledCoursesRef = doc(db, 'students', user.uid);
      const enrolledCoursesDoc = await getDoc(enrolledCoursesRef);
      const existingCourses = enrolledCoursesDoc.exists() ? enrolledCoursesDoc.data().courses || [] : [];

      // Add all items from cart to enrolled courses
      const newCourses = [...existingCourses, ...cartItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        image: item.image
      }))];
      await setDoc(enrolledCoursesRef, { courses: newCourses });

      // Clear the cart
      await clearCart();

      // Show success toast and delay redirection
      toast.success('Purchase successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 7000); // Delay redirection by 7 seconds
    } catch (error) {
      console.error('Error enrolling courses:', error);
      toast.error('Error completing purchase');
    }
  };

  if (!user) {
    return <p>Please log in to view your cart.</p>;
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Cart</h1>
      {cartItems.length > 0 ? (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row bg-white shadow-lg rounded-lg p-4">
              <div className="flex-shrink-0 mb-4 sm:mb-0 sm:w-1/3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-contain rounded-md"
                  />
                )}
              </div>
              <div className="flex-1 sm:ml-4">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="mb-2">{item.description}</p>
                <p className="text-gray-500 mb-2">Price: ${item.price}</p>
                <p className="text-gray-500 mb-4">Quantity: {item.quantity}</p>
                <div className="flex flex-col sm:flex-row">
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition mb-2 sm:mb-0 sm:mr-2"
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
            </div>
          ))}
          <div className="text-center mt-4">
            <h2 className="text-xl font-bold">Total Amount: ${totalAmount}</h2>
          </div>
        </div>
      ) : (
        <p className="text-center">Your cart is empty.</p>
      )}
      <ToastContainer />
    </div>
  );
}

export default CartPage;
