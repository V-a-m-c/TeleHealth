import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getAuth, signOut, sendPasswordResetEmail } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const LoginPage = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const userTypeRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from || '/';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    const email = emailRef.current.value.trim();
    const password = passwordRef.current.value.trim();
    const userType = userTypeRef.current.value;

    if (!email || !password || !userType) {
      setError('Please enter email, password, and select user type.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);

      const auth = getAuth();
      const user = auth.currentUser;
      let userRole = null;

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          userRole = docSnap.data().role;
        }
      }

      if (userRole === userType) {
        if (userRole === 'doctor') {
          navigate('/');
        } else if (userRole === 'admin') {
          navigate('/applications');
        } else {
          navigate(redirectPath);
        }
      } else {
        await signOut(auth);
        setError('Invalid user role');
      }
    } catch (error) {
      setError('Failed to log in. Please try again later.');
    }

    setLoading(false);
  }

  async function handleForgotPassword(e) {
    e.preventDefault();

    const email = emailRef.current.value.trim();

    if (!email) {
      setError('Please enter your email to reset your password.');
      return;
    }

    try {
      setError('');
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setError('Check your inbox for further instructions');
    } catch (error) {
      setError('Failed to send reset email. Please try again later.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lg text-white overscroll-none pt-5">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              placeholder="name@gmail.com"
              ref={emailRef}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
              ref={passwordRef}
              required
            />
          </div>
          <div>
            <label htmlFor="userType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">User Type</label>
            <select
              id="userType"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
              ref={userTypeRef}
              required
            >
              <option value="">Select User Type</option>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-start">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                />
              </div>
              <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
            </div>
            <href to="/" onClick={handleForgotPassword} className="ms-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Forgot Password?</href>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login to your account
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered? <Link to="/signup" className="text-blue-700 hover:underline dark:text-blue-500" style={{textDecoration:'none'}}>Create account</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
