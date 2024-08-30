import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; // Google icon from react-icons

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center bg-white border border-gray-300 text-gray-600 p-3 rounded-lg shadow hover:shadow-md hover:bg-gray-50"
        >
          <FcGoogle className="text-2xl mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
