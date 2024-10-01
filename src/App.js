// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import AdminApproval from './admin/AdminApproval';
// import PricingPage from './pages/PricingPage';
import AvailableDoctors from './components/AvailableDoctors';
import DoctorAppointments from './doctors/DoctorAppointments';
import BookingStatus from './patient/BookingStatus';
import VideoPage from './doctors/VideoPage';
import ScheduleMeet from './doctors/ScheduleMeet';
import MeetingPage from './doctors/MeetingPage';
// import { ThemeProvider } from './ThemeContext'; // import ThemeProvider
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import ApplicationStatus from './pages/ApplicationStatus';
import Message from './admin/Message'
function App() {
  return (
      <AuthProvider>
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/schedule-meet" element={<PrivateRoute role="doctor"><ScheduleMeet /></PrivateRoute>} />
              <Route path="/room/:id" element={<VideoPage />} />
              <Route path="/applications" element={<PrivateRoute role="admin"><AdminApproval /></PrivateRoute>} />
              <Route path="/available-doctors" element={<PrivateRoute role="patient"><AvailableDoctors /></PrivateRoute>} />
              <Route path="/appointments" element={<PrivateRoute role="doctor"><DoctorAppointments /></PrivateRoute>} />
              <Route path="/booking-status" element={<PrivateRoute role="patient"><BookingStatus /></PrivateRoute>} />
              <Route path="/meeting-page" element={<MeetingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/application-status" element={<PrivateRoute role="doctor"><ApplicationStatus /></PrivateRoute>} />
              <Route path="/message" element={<PrivateRoute role="admin"><Message /></PrivateRoute>} />
            </Routes>
          </Router>
        </div>
      </AuthProvider>
  );
}

export default App;
