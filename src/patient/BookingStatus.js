import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Button } from 'react-bootstrap';
// import '../styles.css';

const BookingStatus = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsQuery = query(
          collection(db, 'appointments'),
          where('patientEmail', '==', currentUser.email)
        );
        const appointmentsSnapshot = await getDocs(appointmentsQuery);

        const fetchedAppointments = await Promise.all(
          appointmentsSnapshot.docs.map(async (appointmentDoc) => {
            const appointmentData = appointmentDoc.data();
            const doctorDocRef = doc(db, 'applications', appointmentData.doctorId);
            const doctorDoc = await getDoc(doctorDocRef);
            const doctorData = doctorDoc.exists() ? doctorDoc.data() : {};
            return {
              id: appointmentDoc.id,
              ...appointmentData,
              doctorName: doctorData.name || 'N/A', // Assuming 'name' is the field in 'applications' for doctor's name
            };
          })
        );

        setAppointments(fetchedAppointments);
        console.log('Fetched appointments:', fetchedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, [currentUser.email]);

  const openMaps = (latitude, longitude) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ backgroundColor: 'white', color: 'black', minHeight: '91vh', padding: '20px', paddingTop: '80px' }}>
      <h1>Your Booking Status</h1>
      {appointments.length === 0 ? (
        <p>No appointments at the moment.</p>
      ) : (
        <div className="row">
          {appointments.map((appointment, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div
                className="card bg-dark text-white h-100 shadow-lg"
                onMouseEnter={(e) => { e.currentTarget.classList.add('card-hover'); }}
                onMouseLeave={(e) => { e.currentTarget.classList.remove('card-hover'); }}
              >
                <div className="card-body">
                  <h5 className="card-title">Appointment with Dr. {appointment.doctorName}</h5>
                  <p className="card-text">Age: {appointment.patientAge}</p>
                  <p className="card-text">Place: {appointment.patientPlace}</p>
                  <p className="card-text">Mode: {appointment.mode}</p>
                  <p className="card-text">
                    Date: {appointment.date ? appointment.date.toDate().toLocaleDateString() : 'N/A'}
                  </p>
                  <p className="card-text">Time: {appointment.time || 'N/A'}</p>
                  <p className="card-text">Status: {appointment.status}</p>
                  {appointment.mode === 'offline' && appointment.location && (
                    <div>
                      <p className="card-text">Location: {appointment.location.latitude}, {appointment.location.longitude}</p>
                      <Button variant="success btn-block" onClick={() => openMaps(appointment.location.latitude, appointment.location.longitude)}>
                        Locate
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingStatus;
