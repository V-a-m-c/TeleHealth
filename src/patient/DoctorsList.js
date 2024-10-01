import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const q = query(collection(db, 'doctorApplications'), where('status', '==', 'approved'));
      const querySnapshot = await getDocs(q);
      const doctorsList = [];
      querySnapshot.forEach((doc) => {
        doctorsList.push({ id: doc.id, ...doc.data() });
      });
      setDoctors(doctorsList);
      setLoading(false);
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>List of Approved Doctors</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id}>
            <strong>Name:</strong> {doctor.name}, <strong>Specialty:</strong> {doctor.specialty}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorsList;
