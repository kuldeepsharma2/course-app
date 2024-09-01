// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

const PrivateRoute = ({ children }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If user is logged in, render the children components
  return children;
};

export default PrivateRoute;
