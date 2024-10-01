import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import useUserRole from '../contexts/useUserRole'; // Import useUserRole hook
import { db } from '../firebase'; // Import Firebase Firestore
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const MeetingPage = () => {
  const { currentUser } = useAuth(); // Destructure currentUser from useAuth hook
  const { role, loading: roleLoading } = useUserRole(); // Destructure role and roleLoading from useUserRole hook
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [newDateTime, setNewDateTime] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  const fetchMeetings = useCallback(async () => {
    const meetingsCollection = collection(db, 'meetings');
    let q;
    if (role === 'patient') {
      q = query(meetingsCollection, where('patientEmail', '==', currentUser.email));
    } else if (role === 'doctor') {
      q = query(meetingsCollection, where('doctorEmail', '==', currentUser.email));
    } else {
      q = query(meetingsCollection);
    }
    const querySnapshot = await getDocs(q);
    const fetchedMeetings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMeetings(fetchedMeetings);

    // Store meetings in local storage
    localStorage.setItem('meetings', JSON.stringify(fetchedMeetings));
  }, [currentUser, role]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  // Automatically delete past meetings
  useEffect(() => {
    const deletePastMeetings = async () => {
      const now = Date.now();
      const toDelete = meetings.filter(meeting => now > (meeting.scheduledTime + 10 * 60 * 1000));
      for (const meeting of toDelete) {
        const meetingDoc = doc(db, 'meetings', meeting.id);
        await deleteDoc(meetingDoc);
      }
      if (toDelete.length > 0) {
        fetchMeetings();
      }
    };
    const interval = setInterval(deletePastMeetings, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [meetings, fetchMeetings]);

  const handleScheduleClick = () => {
    navigate('/appointments');
  };

  const joinRoom = (id, scheduledTime) => {
    const now = Date.now();
    if (now < scheduledTime) {
      setAlertMessage('This is not the meeting time yet. Please wait for the scheduled time.');
      return;
    }
    navigate(`/room/${id}`);
  };

  const handleReschedule = (index) => {
    setShowModal(true);
    setSelectedIndex(index);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedIndex(null);
    setNewDateTime('');
    setError('');
  };

  const handleModalSave = async () => {
    if (!newDateTime) {
      setError('Please select a new date and time.');
      return;
    }

    const [newDate, newTime] = newDateTime.split('T');
    const newScheduledTime = new Date(newDateTime).getTime();
    const now = Date.now();

    if (newScheduledTime <= now) {
      setError('Please select a future date and time.');
      return;
    }

    // Check for overlapping meetings
    for (const meeting of meetings) {
      if (meeting.roomId === meetings[selectedIndex].roomId && meeting.id !== meetings[selectedIndex].id) {
        if (Math.abs(meeting.scheduledTime - newScheduledTime) < 10 * 60 * 1000) {
          setError('Meeting times should be at least 10 minutes apart.');
          return;
        }
      }
    }

    const updatedMeetings = [...meetings];
    updatedMeetings[selectedIndex] = {
      ...updatedMeetings[selectedIndex],
      date: newDate,
      time: newTime,
      scheduledTime: newScheduledTime,
    };

    setMeetings(updatedMeetings);

    const meetingDoc = doc(db, 'meetings', updatedMeetings[selectedIndex].id);
    await updateDoc(meetingDoc, {
      date: newDate,
      time: newTime,
      scheduledTime: newScheduledTime,
    });

    // Update local storage after rescheduling
    localStorage.setItem('meetings', JSON.stringify(updatedMeetings));

    handleModalClose();
  };

  if (roleLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-5 pt-16 px-4 sm:px-0">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4 bg-blue-600 text-white d-flex justify-content-between align-items-center">
          <h3 className="text-xl font-bold">Scheduled Meetings</h3>
          {role === 'doctor' && (
            <Button onClick={handleScheduleClick} variant="outline-light">
              Schedule New Meeting
            </Button>
          )}
        </div>
        <div className="p-4">
          {alertMessage && <div className="alert alert-warning">{alertMessage}</div>}
          {meetings.length > 0 ? (
            <ul className="list-group">
              {meetings.map((meeting, index) => (
                <li key={index} className="list-group-item d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                  <div className="mb-2 mb-md-0">
                    <h5>Room ID: {meeting.roomId}</h5>
                    <p>Doctor Name: {meeting.doctorName}</p>
                    <p>Patient Name: {meeting.patientName}</p>
                    <p>Date: {meeting.date}</p>
                    <p>Time: {meeting.time}</p>
                  </div>
                  <div className="d-flex flex-column flex-md-row">
                    <Button onClick={() => joinRoom(meeting.roomId, meeting.scheduledTime)} variant="success" className="mb-2 mb-md-0 mr-md-2 mr-2" style={{border:'2px solid black'}}>Join Meeting</Button>
                    {role === 'doctor' && (
                      <Button onClick={() => handleReschedule(index)} variant="secondary" style={{border:'2px solid black'}}>Reschedule</Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="alert alert-info" role="alert">
              No scheduled meetings.
            </div>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Reschedule Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}
          <Form>
            <Form.Group>
              <Form.Label>Select New Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MeetingPage;
