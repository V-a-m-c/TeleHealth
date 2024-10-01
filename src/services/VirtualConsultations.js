// src/services/VirtualConsultations.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VirtualConsultations = () => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/videopage');
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body" style={{ backgroundColor: '#f8d7da', height: '10rem', border: '3px solid black' }}>
              <h5 className="card-title">Appointment Scheduling</h5>
              <p className="card-text">Easily schedule and manage your appointments.</p>
              <Link to="/services/virtual-consultations/appointment-scheduling" className="btn btn-primary" style={{ border: '2px solid black' }}>Schedule</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-body" style={{ backgroundColor: '#fff3cd', height: '10rem', border: '3px solid black' }}>
              <h5 className="card-title">Video Conferencing</h5>
              <p className="card-text">Conduct secure video consultations with ease.</p>
              <button onClick={handleCardClick} className="btn btn-primary" style={{ border: '2px solid black' }}>Conference</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualConsultations;
