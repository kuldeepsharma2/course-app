// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseListingPage from './pages/CourseListingPage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import AddCourse from './pages/AddCourse';
import Header from './components/Header';
import Footer from './components/Footer'; // Import Footer
import PrivateRoute from './components/PrivateRoute';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow pt-16 pb-16"> {/* Adjust padding to account for header and footer heights */}
            <Routes>
              <Route path="/" element={<CourseListingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/addcourse" element={<AddCourse />} />
              <Route path="/courses/:id" element={<CourseDetailsPage />} />
              <Route path="/course-detail" element={<CourseDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <StudentDashboardPage />
                </PrivateRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
