import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [error, setError] = useState(''); // State for error message
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError(''); // Clear previous errors
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate('/'); // Redirect to the dashboard after successful login
    } catch (error) {
      // Handle possible errors
      if (error.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with a different credential.');
        alert('An account already exists with a different credential.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setError('Popup request was canceled.');
        alert('Popup request was canceled.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        setError('The popup was closed before completing the sign in.');
        alert('The popup was closed before completing the sign in.');
      } else {
        setError('An error occurred. Please try again.');
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white p-2 rounded"
      >
        Sign in with Google
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>} {/* Display error message */}
    </div>
  );
}

export default Login;
