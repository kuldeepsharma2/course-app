// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseListingPage from './pages/CourseListingPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import AddCourse from './pages/AddCourse';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <Router>
      <CartProvider>
      <div className="App">
        {/* Include Header Component */}
        <Header />

        {/* Define Routes */}
        <Routes>
          <Route path="/" element={<CourseListingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addcourse" element={<AddCourse />} />
          <Route path="/course/:id" element={<CourseDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* Protect the dashboard with PrivateRoute */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <StudentDashboardPage />
              </PrivateRoute>
            }
          />
        </Routes>
        </div>
        </CartProvider>
    </Router>
  );
}

export default App;
