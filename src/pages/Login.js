import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      navigate('/'); // Redirect to the dashboard after successful login
    } catch (error) {
      alert('An error occurred during sign-in. Please try again.'); // Simple error handling
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
    </div>
  );
}

export default Login;
