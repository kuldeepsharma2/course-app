import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useCart } from '../contexts/CartContext';

function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();
  const { cart } = useCart();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAddCourse = () => {
    if (user) {
      navigate('/AddCourse');
    } else {
      navigate('/login');
    }
  };

  const getCartQuantity = () => {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  return (
    <header className="bg-gray-800 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="hover:text-gray-400">Courses</Link>
        </h1>
        <div className="hidden md:flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300">Courses</Link>
            {user && (
              <Link to="/dashboard" className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300">Student Dashboard</Link>
            )}
            {user ? (
              <Link to="/cart" className="relative hover:bg-gray-700 px-3 py-2 rounded transition duration-300">
                Cart
                {getCartQuantity() > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 -translate-x-1/2 -translate-y-1/2">{getCartQuantity()}</span>
                )}
              </Link>
            ) : (
              <Link to="/login" className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300">Login</Link>
            )}
            <button
              onClick={handleAddCourse}
              className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300"
            >
              Add Course
            </button>
            {!user ? (
              <Link to="/register" className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300">Register</Link>
            ) : (
              <button onClick={handleLogout} className="text-red-500 hover:bg-gray-700 px-3 py-2 rounded transition duration-300">
                Logout
              </button>
            )}
          </nav>
        </div>
        <button 
          className="md:hidden text-white focus:outline-none" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      <div 
        className={`md:hidden fixed top-0 left-0 w-full bg-gray-800 text-white transition-transform transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">Menu</h1>
          <button
            className="text-white focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <nav className="flex flex-col items-start p-4 space-y-4">
          <Link to="/" className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300" onClick={() => setIsMenuOpen(false)}>Courses</Link>
          {user && (
            <Link to="/dashboard" className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300" onClick={() => setIsMenuOpen(false)}>Student Dashboard</Link>
          )}
          {user ? (
            <Link to="/cart" className="relative hover:bg-gray-700 px-3 py-2 rounded transition duration-300" onClick={() => setIsMenuOpen(false)}>
              Cart
              {getCartQuantity() > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-2 py-1 -translate-x-1/2 -translate-y-1/2">{getCartQuantity()}</span>
              )}
            </Link>
          ) : (
            <Link to="/login" className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300" onClick={() => setIsMenuOpen(false)}>Login</Link>
          )}
          <button
            onClick={() => { handleAddCourse(); setIsMenuOpen(false); }}
            className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300"
          >
            Add Course
          </button>
          {!user ? (
            <Link to="/register" className="hover:bg-gray-700 px-3 py-2 rounded transition duration-300" onClick={() => setIsMenuOpen(false)}>Register</Link>
          ) : (
            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-500 hover:bg-gray-700 px-3 py-2 rounded transition duration-300">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
