import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { db } from '../firebase'; // Import Firebase Firestore
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const ScheduleMeet = () => {
  const { currentUser } = useAuth(); // Get the current user
  const [input, setInput] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const { patientEmail } = location.state || {}; // Get patient email from location state
  const [meetings, setMeetings] = useState([]);

  const fetchMeetings = useCallback(async () => {
    const meetingsCollection = collection(db, 'meetings');
    const q = query(meetingsCollection, where('doctorEmail', '==', currentUser.email));
    const querySnapshot = await getDocs(q);
    const fetchedMeetings = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setMeetings(fetchedMeetings);
  }, [currentUser.email]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const validateForm = () => {
    if (!input || !doctorName || !patientName || !date || !time) {
      setError('Please fill in all fields.');
      return false;
    }
    return true;
  };

  const checkForConflicts = () => {
    const newScheduledTime = new Date(`${date}T${time}`).getTime();

    for (const meeting of meetings) {
      if (meeting.roomId === input) {
        setError('Room ID already exists. Please choose a different Room ID.');
        return true;
      }

      const timeDifference = Math.abs(meeting.scheduledTime - newScheduledTime);
      if (timeDifference < 10 * 60 * 1000) {
        setError('Meeting times should be at least 10 minutes apart.');
        return true;
      }
    }

    return false;
  };

  const submitHandler = async () => {
    if (!validateForm()) {
      return;
    }

    const scheduledTime = new Date(`${date}T${time}`).getTime();
    if (scheduledTime <= Date.now()) {
      setError('Please select a future time for the meeting.');
      return;
    }

    if (checkForConflicts()) {
      return;
    }

    const meetingDetails = {
      roomId: input,
      doctorName,
      patientName,
      doctorEmail: currentUser.email, // Store the doctor's email
      patientEmail: patientEmail || currentUser.email, // Use patientEmail prop or current user's email
      date,
      time,
      scheduledTime,
    };

    try {
      const docRef = await addDoc(collection(db, 'meetings'), meetingDetails);
      setMeetings([...meetings, { id: docRef.id, ...meetingDetails }]);
      setInput('');
      setDoctorName('');
      setPatientName('');
      setDate('');
      setTime('');
      setError('');
    } catch (e) {
      setError('Error adding meeting: ' + e.message);
    }
  };

  useEffect(() => {
    if (location.state) {
      setPatientName(location.state.patientName || '');
    }
  }, [location.state]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 pt-14 pb-16">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mt-14">
        <h3 className="text-2xl font-semibold text-center text-indigo-600 mb-6">Schedule a New Meeting</h3>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        <form>
          <div className="mb-4">
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">Room ID</label>
            <input
              type="text"
              id="roomId"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700">Doctor Name</label>
            <input
              type="text"
              id="doctorName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">Patient Name</label>
            <input
              type="text"
              id="patientName"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              disabled={Boolean(location.state && location.state.patientName)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              id="time"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={submitHandler}
          >
            Schedule Meeting
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeet;
