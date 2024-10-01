import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, addDoc, getDoc } from 'firebase/firestore';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from '../contexts/AuthContext';
import '../avlDoct.css';

const AvailableDoctors = () => {
  const { currentUser } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    name: '',
    age: '',
    place: '',
    mode: 'online', // Initial mode selection
    date: new Date(),
    time: '',
    patientEmail: currentUser ? currentUser.email : '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const applicationsQuery = query(collection(db, 'applications'), where('status', '==', 'approved'));
        const applicationsSnapshot = await getDocs(applicationsQuery);

        const approvedDoctors = await Promise.all(applicationsSnapshot.docs.map(async (applicationDoc) => {
          const applicationData = applicationDoc.data();
          const userDocRef = doc(db, 'users', applicationDoc.id);
          const userDoc = await getDoc(userDocRef); // Fetching user data based on applicationDoc.id
          const userData = userDoc.exists() ? userDoc.data() : {};
          return { ...applicationData, ...userData, id: applicationDoc.id };
        }));

        console.log('Fetched doctors:', approvedDoctors);
        setDoctors(approvedDoctors);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  const handleShow = (doctor) => {
    setSelectedDoctor(doctor);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedDoctor(null);
    resetForm();
  };

  const resetForm = () => {
    setAppointmentDetails({
      name: '',
      age: '',
      place: '',
      mode: 'online', // Reset mode to initial selection
      date: new Date(),
      time: '',
      patientEmail: currentUser ? currentUser.email : '',
    });
    setFormSubmitted(false);
    setDateError('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setAppointmentDetails((prevDetails) => ({
      ...prevDetails,
      date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    // Check if age is positive
    if (parseInt(appointmentDetails.age) <= 0) {
      alert('Age must be a positive number.');
      return;
    }

    // Check if selected date is in the past
    const now = new Date();
    if (appointmentDetails.date < now) {
      setDateError('Please select a future date.');
      return;
    } else {
      setDateError('');
    }

    const appointmentData = {
      patientName: appointmentDetails.name,
      patientAge: appointmentDetails.age,
      patientPlace: appointmentDetails.place,
      mode: appointmentDetails.mode,
      date: appointmentDetails.date,
      time: appointmentDetails.time,
      doctorId: selectedDoctor.id,
      status: 'pending',
      patientEmail: appointmentDetails.patientEmail,
    };

    try {
      await addDoc(collection(db, 'appointments'), appointmentData);
      console.log('Appointment request submitted:', appointmentData);
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error submitting appointment request:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 md:px-8 pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Available Doctors</h1>
      {doctors.length === 0 ? (
        <p>No available doctors at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {doctors.map((doctor, index) => (
            <div key={index} className="mb-4">
              <div
                className="card bg-dark text-white h-100 shadow-lg"
                onMouseEnter={(e) => { e.currentTarget.classList.add('card-hover'); }}
                onMouseLeave={(e) => { e.currentTarget.classList.remove('card-hover'); }}
              >
                <div className="card-body">
                  <h5 className="card-title text-xl md:text-2xl font-bold">{doctor.name.toUpperCase()}</h5>
                  <p className="card-text">Specialty: {doctor.specialty || 'N/A'}</p>
                  <p className="card-text">Email: {doctor.email || 'N/A'}</p>
                  <p className="card-text">Experience: {doctor.experience || 'N/A'}</p>
                  <p className="card-text">Languages: {doctor.languages || 'N/A'}</p>
                  <p className="card-text">License: {doctor.license || 'N/A'}</p>
                  <p className="card-text">Living Place: {doctor.livingPlace || 'N/A'}</p>
                  <Button variant="success" onClick={() => handleShow(doctor)}>Book Appointment</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment with {selectedDoctor?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formSubmitted ? (
            <Alert variant="success">Form submitted successfully. Please wait for approval.</Alert>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={appointmentDetails.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formAge">
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  name="age"
                  value={appointmentDetails.age}
                  onChange={handleChange}
                  min="1" // Ensure minimum age is 1
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formPlace">
                <Form.Label>Place</Form.Label>
                <Form.Control
                  type="text"
                  name="place"
                  value={appointmentDetails.place}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formMode">
                <Form.Label>Mode</Form.Label>
                <Form.Select
                  name="mode"
                  value={appointmentDetails.mode}
                  onChange={handleChange}
                  required
                  disabled={formSubmitted} // Disable after form submission
                >
                  <option disabled>Select Mode</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDate">
                <Form.Label>Date</Form.Label>
                <DatePicker
                  selected={appointmentDetails.date}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  className="form-control"
                  minDate={new Date()}
                  required
                />
                {dateError && (
                  <p className="text-danger">{dateError}</p>
                )}
              </Form.Group>
              <Form.Group className="mb-3" controlId="formTime">
                <Form.Label>Time</Form.Label>
                <Form.Select
                  name="time"
                  value={appointmentDetails.time}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Time</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </Form.Select>
              </Form.Group>
              <Button variant="secondary" type="submit">
                Submit
              </Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AvailableDoctors;
