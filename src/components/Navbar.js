// src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useUserRole from '../contexts/useUserRole';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { currentUser, logout, applicationStatus } = useAuth();
  const { role } = useUserRole();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  }

  return (
    <Disclosure as="nav" className="bg-gray-900 fixed top-0 left-0 w-full z-10">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0">
                  <Link to="/" className="font-bold text-xl text-white" style={{ textDecoration: 'none' }}>Telehealth</Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {(!currentUser) && (
                      <>
                        <Link to="/" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Home</Link>
                        <Link to="/about" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>About</Link>
                      </>
                    )}
                    {currentUser && role === 'patient' && (
                      <>
                        <Link to="/" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Home</Link>
                        <Link to="/about" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>About</Link>
                        <Link to="/available-doctors" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Available Doctors</Link>
                        <Link to="/booking-status" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Booking Status</Link>
                        <Link to="/meeting-page" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Conference</Link>
                      </>
                    )}
                    {currentUser && role === 'doctor' && (
                      <>
                        <Link to="/" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Home</Link>
                        <Link to="/about" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>About</Link>
                        {applicationStatus === 'approved' && (
                          <>
                            <Link to="/appointments" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Appointments</Link>
                            <Link to="/meeting-page" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Conference</Link>
                          </>
                        )}
                        <Link to="/application-status" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Application</Link>
                      </>
                    )}
                    {currentUser && role === 'admin' && (
                      <>
                        <Link to="/" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Home</Link>
                        <Link to="/about" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>About</Link>
                        <Link to="/applications" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Applications</Link>
                        <Link to="/message" className="hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium text-white" style={{ textDecoration: 'none' }}>Messages</Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                {currentUser ? (
                  <button onClick={handleLogout} className="text-white bg-red-600  px-3 py-2 rounded-md text-sm font-medium">
                    Logout
                  </button>
                ) : (<>
                  <Link to="/login" className="inline-block text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium mr-3" style={{ textDecoration: 'none' }}>
                    Login
                  </Link>
                  <Link to="/signup" className="text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium" style={{ textDecoration: 'none' }}>
                    Signup
                  </Link>
                  </>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              <Link to="/" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>Home</Link>
              <Link to="/about" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>About</Link>
              {currentUser && role === 'patient' && (
                <>
                  <Link to="/available-doctors" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>Available Doctors</Link>
                  <Link to="/booking-status" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>Booking Status</Link>
                  <Link to="/meeting-page" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>Conference</Link>
                </>
              )}
              {currentUser && role === 'doctor' && applicationStatus === 'approved' && (
                <>
                  <Link to="/appointments" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>Appointments</Link>
                  <Link to="/meeting-page" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>Conference</Link>
                </>
              )}
              {currentUser && role === 'doctor' && (
                <Link to="/application-status" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>Application Status</Link>
              )}
              {currentUser && role === 'admin' && (
                <>
                  <Link to="/applications" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>Applications</Link>
                  <Link to="/message" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{ textDecoration: 'none' }}>Messages</Link>
                </>
              )}
              {currentUser && (
                <button onClick={handleLogout} className="w-full text-left text-white  px-3 py-2 rounded-md text-base font-medium">
                  Logout
                </button>
              )}
              {!currentUser && (
                <>
                <Link to="/login" className="block text-white hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium" style={{textDecoration:'none'}}>
                  Login
                </Link>
                <Link to="/signup" className="block no-underline hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium text-white">Signup</Link>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
