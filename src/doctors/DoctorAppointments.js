import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from 'react-bootstrap';
import '../styles.css';

const DoctorAppointments = () => {
  const navigate = useNavigate(); // Initialize useHistory
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsQuery = query(collection(db, 'appointments'), where('doctorId', '==', currentUser.uid));
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const fetchedAppointments = appointmentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, [currentUser.uid]);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      const appointmentDocRef = doc(db, 'appointments', appointmentId);
      let updatedData = { status };

      if (status === 'approved') {
        if (window.navigator.geolocation) {
          window.navigator.geolocation.getCurrentPosition(
            async (position) => {
              const location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              };
              updatedData.location = location;
              await updateDoc(appointmentDocRef, updatedData);
              setAppointments(prevAppointments =>
                prevAppointments.map(appointment =>
                  appointment.id === appointmentId ? { ...appointment, ...updatedData } : appointment
                )
              );
            },
            (error) => {
              console.error('Error getting location:', error);
              // Handle the case where the doctor denies location access or there's an error
            }
          );
        } else {
          console.error('Geolocation is not supported by this browser.');
        }
      } else {
        await updateDoc(appointmentDocRef, updatedData);
        setAppointments(prevAppointments =>
          prevAppointments.map(appointment =>
            appointment.id === appointmentId ? { ...appointment, ...updatedData } : appointment
          )
        );
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };
    const handleSchedule = (patientEmail) => {
      // Navigate to scheduling page using history.push and pass patientEmail
      navigate(`/schedule-meet`, { state: { patientEmail } });
    };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center pt-16" style={{ minHeight: '91vh' }}>
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  const onlineAppointments = appointments.filter(appointment => appointment.mode === 'online');
  const offlineAppointments = appointments.filter(appointment => appointment.mode === 'offline');

  return (
    <div className="container-fluid bg-white text-dark" style={{ minHeight: '91vh', padding: '70px' }}>
      <h1 className="mb-4"><b>Your Appointments</b></h1>
      {appointments.length === 0 ? (
        <p>No appointments at the moment.</p>
      ) : (
        <>
          {onlineAppointments.length > 0 && (
            <>
              <h3 className="mb-3">Online Appointments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {onlineAppointments.map((appointment, index) => (
                  <div key={index} className="col">
                    <div className="card bg-dark text-white h-100 shadow-lg card-hover" style={{ transition: 'all 0.3s ease' }}>
                      <div className="card-body"
                        onMouseEnter={(e) => { e.currentTarget.classList.add('card-hover'); }}
                        onMouseLeave={(e) => { e.currentTarget.classList.remove('card-hover'); }}
                      >
                        <h5 className="card-title">Appointment with {appointment.patientName}</h5>
                        <p className="card-text">Email: {appointment.patientEmail}</p>
                        <p className="card-text">Age: {appointment.patientAge}</p>
                        <p className="card-text">Place: {appointment.patientPlace}</p>
                        <p className="card-text">Mode: {appointment.mode}</p>
                        <p className="card-text">Date: {appointment.date ? appointment.date.toDate().toLocaleDateString() : 'N/A'}</p>
                        <p className="card-text">Time: {appointment.time || 'N/A'}</p>
                        <p className="card-text">Status: {appointment.status}</p>
                        {appointment.status === 'pending' && (
                          <div>
                            <button className="btn btn-success" onClick={() => handleStatusChange(appointment.id, 'approved')}>
                              Approve
                            </button>{' '}
                            <button className="btn btn-danger" onClick={() => handleStatusChange(appointment.id, 'rejected')}>
                              Reject
                            </button>
                          </div>
                        )}
                        {appointment.status === 'approved' && (
                        <button className="btn btn-primary mt-2" onClick={() => handleSchedule(appointment.patientEmail)}>
                          Schedule
                        </button>
                      )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {offlineAppointments.length > 0 && (
            <>
              <h3 className="mt-5 mb-3">Offline Appointments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offlineAppointments.map((appointment, index) => (
                  <div key={index} className="col">
                    <div className="card bg-dark text-white h-100 shadow-lg card-hover" >
                      <div className="card-body"
                        onMouseEnter={(e) => { e.currentTarget.classList.add('card-hover'); }}
                        onMouseLeave={(e) => { e.currentTarget.classList.remove('card-hover'); }}
                      >
                        <h5 className="card-title">Appointment with {appointment.patientName}</h5>
                        <p className="card-text">Email: {appointment.patientEmail}</p>
                        <p className="card-text">Age: {appointment.patientAge}</p>
                        <p className="card-text">Place: {appointment.patientPlace}</p>
                        <p className="card-text">Mode: {appointment.mode}</p>
                        <p className="card-text">Date: {appointment.date ? appointment.date.toDate().toLocaleDateString() : 'N/A'}</p>
                        <p className="card-text">Time: {appointment.time || 'N/A'}</p>
                        <p className="card-text">Status: {appointment.status}</p>
                        {appointment.status === 'pending' && (
                          <div>
                            <button className="btn btn-success" onClick={() => handleStatusChange(appointment.id, 'approved')}>
                              Approve
                            </button>{' '}
                            <button className="btn btn-danger" onClick={() => handleStatusChange(appointment.id, 'rejected')}>
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default DoctorAppointments;
