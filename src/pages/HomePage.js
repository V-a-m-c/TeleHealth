import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use usenavigate for redirecting
import useUserRole from '../contexts/useUserRole';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed
import { useAuth } from '../contexts/AuthContext'; // Import useAuth for authentication context

const HomePage = () => {
  const { role} = useUserRole();
  const { currentUser: authUser } = useAuth(); // Get current user from AuthContext
  const [showMore, setShowMore] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState({ type: '', message: '' }); // Added state for alerts
  const navigate = useNavigate(); // For redirecting to login page

  const handleLearnMore = () => {
    setShowMore(!showMore);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser) {
      setAlert({ type: 'danger', message: 'Please log in first.' });
      navigate('/login'); // Redirect to login page
      return;
    }

    // Check if all fields are filled
    if (!name || !email || !message) {
      setAlert({ type: 'danger', message: 'Please fill out all fields.' });
      return;
    }

    setAlert({ type: '', message: '' });

    try {
      const docRef = await addDoc(collection(db, 'messages'), {
        name,
        email,
        message,
        role,
        timestamp: new Date(),
      });
      console.log('Document written with ID: ', docRef.id);
      setName('');
      setEmail('');
      setMessage('');
      setAlert({ type: 'success', message: 'Message sent successfully!' });
    } catch (e) {
      console.error('Error adding document: ', e);
      setAlert({ type: 'danger', message: 'Error sending message.' });
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Your Telehealth Solution</h1>
          <p className="text-lg text-gray-700 mb-8">Connecting you with healthcare professionals anytime, anywhere.</p>
          <div>
            {/* Conditional rendering based on user role */}
            {role === 'patient' && (
              <React.Fragment>
                <Link to="/available-doctors">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mr-2">Book Appointment</button>
                </Link>
                <Link to="/booking-status">
                  <button className="bg-transparent border border-blue-500 text-blue-500 hover:text-black hover:bg-blue-500 font-bold py-2 px-6 mr-2 rounded mt-2">Booking Status</button>
                </Link>
              </React.Fragment>
            )}
            {role === 'doctor' && (
              <React.Fragment>
                <Link to="/application-status">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded mr-4">Application Status</button>
                </Link>
                <Link to="/appointments">
                  <button className="bg-transparent border border-blue-500 text-blue-500 hover:text-black hover:bg-blue-500 font-bold py-2 px-6 mr-3.5 rounded mt-2">Appointments</button>
                </Link>
              </React.Fragment>
            )}
            {role === null && (
              <>
                <button onClick={handleLearnMore} className="bg-transparent border border-blue-500 text-blue-500 hover:text-black hover:bg-blue-500 font-bold py-2 px-6 rounded">
                  Learn More
                </button>
                {showMore && (
                  <div className="mt-8 text-left bg-white p-6 rounded shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">About Our Telehealth Platform</h2>
                    <p className="mb-4">Our telehealth platform provides seamless authentication and scheduling of meetings between patients and doctors. Whether you prefer online or offline consultations, our platform has got you covered.</p>
                    <h3 className="text-xl font-semibold mb-2">Book Offline Meetings</h3>
                    <p className="mb-4">Patients can easily book offline meetings with doctors. After the doctor approves the booking, patients can locate the doctor by clicking the 'Locate' button.</p>
                    <h3 className="text-xl font-semibold mb-2">Secure and Convenient</h3>
                    <p className="mb-4">Our platform ensures your privacy and data security. Access healthcare services remotely, at your convenience, anytime and anywhere.</p>
                    <h3 className="text-xl font-semibold mb-2">Comprehensive Services</h3>
                    <p>We offer a wide range of healthcare services available online, making it easier for you to get the medical attention you need without leaving your home.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
          <div className="flex flex-wrap justify-center">
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-blue-100 p-6 rounded">
                <h3 className="text-xl font-semibold mb-4">Convenient</h3>
                <p className="text-gray-700">Access healthcare services remotely, at your convenience.</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-blue-100 p-6 rounded">
                <h3 className="text-xl font-semibold mb-4">Secure</h3>
                <p className="text-gray-700">Your privacy and data security are our top priorities.</p>
              </div>
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/3 px-4 mb-8">
              <div className="bg-blue-100 p-6 rounded">
                <h3 className="text-xl font-semibold mb-4">Comprehensive</h3>
                <p className="text-gray-700">Wide range of healthcare services available online.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="text-gray-600 body-font relative bg-black">
        <div className="container px-5 py-16 mx-auto">
          <div className="flex flex-col text-center w-full mb-8">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-white">Contact Us</h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-white text-base">Whatever doubts or queries you have, please write a message and we will reach out to you by email.</p>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-wrap -m-1">
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label htmlFor="name" className="leading-7 text-sm text-white">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-white py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-2 w-1/2">
                  <div className="relative">
                    <label htmlFor="email" className="leading-7 text-sm text-white">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-white py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-2 w-full">
                  <div className="relative">
                    <label htmlFor="message" className="leading-7 text-sm text-white">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-black focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-white py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="p-2 w-full">
                  <button type="submit" className="flex mx-auto text-black bg-white border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Send Message</button>
                </div>
              </div>
              {/* Displaying alerts */}
              {alert.message && (
                <div className={`mt-4 text-center ${alert.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {alert.message}
                </div>
              )}
            </form>
            <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
              <a href="mailto:korlavamsi74@gmail.com" className="text-indigo-500 block mb-2" style={{ textDecoration: 'none' }}>Click Here to Email Us</a>
            </div>
            <div className="w-full flex justify-center mt-4">
              <a href="https://www.instagram.com/va_m_c_?igsh=MTR2N21mOHNwb2F2Mw==" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/128/1384/1384063.png" className="w-12 h-12 mx-2" alt="Social Media 1" />
              </a>
              <a href="https://www.facebook.com/vamsi.korla?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/128/725/725289.png" className="w-12 h-12 mx-2" alt="Social Media 2" />
              </a>
              <a href="mailto:korlavamsi74@gmail.com" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/128/10829/10829119.png" className="w-12 h-12 mx-2" alt="Social Media 3" />
              </a>
              <a href="https://x.com/va_m_c?t=uXvwRcGgPhRdBeKlI0YDLw&s=09" target="_blank" rel="noopener noreferrer">
                <img src="https://cdn-icons-png.flaticon.com/128/2335/2335289.png" className="w-12 h-12 mx-2" alt="Social Media 4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
