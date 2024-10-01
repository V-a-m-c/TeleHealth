import React, { useState } from "react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const [cardColors, setCardColors] = useState({
    virtualConsultations: "#f8d7da",
    healthMonitoring: "#fff3cd",
  });

  const handleCardClick = (service) => {
    const newColors = {
      virtualConsultations: "pink",
      healthMonitoring: "#fff3cd",
    };

    newColors[service] = "#add8e6"; // New color on click

    setCardColors(newColors);
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <div className="card service-card mb-4">
            <div
              className="card-body"
              style={{
                backgroundColor: cardColors.virtualConsultations,
                minHeight: "20rem",
                border: "3px solid black",
              }}
            >
              <h5 className="card-title">Virtual Consultations</h5>
              <p className="card-text">
                Introducing our groundbreaking virtual consultation platform,
                where scheduling meetings and attending conferences with doctors
                has never been easier. Seamlessly book appointments, engage in
                face-to-face consultations from the comfort of your home, and
                access a diverse network of specialists across various medical
                fields. With secure communication channels and interactive
                sessions, empower yourself with convenient access to quality
                healthcare anytime, anywhere. Join us today to experience the
                future of healthcare firsthand.
              </p>
              <Link
                to="/services/virtual-consultations"
                className="btn btn-primary"
                style={{ border: "2px solid black" }}
                onClick={() => handleCardClick("virtualConsultations")}
              >
                Open
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card service-card mb-4">
            <div
              className="card-body"
              style={{
                backgroundColor: cardColors.healthMonitoring,
                minHeight: "20rem",
                border: "3px solid black",
              }}
            >
              <h5 className="card-title">Health Monitoring</h5>
              <p className="card-text">
                Introducing our innovative health monitoring platform, where
                tracking your well-being is effortless and insightful. Monitor
                vital signs, track activity levels, and receive personalized
                insights to optimize your health journey. With user-friendly
                interfaces and real-time data analysis, take control of your
                health like never before. Join us today and embark on a journey
                towards a healthier, happier you. Discover trends, set goals,
                and make informed decisions to achieve your wellness objectives.
              </p><br />
              <Link
                to="/services/health-monitoring"
                className="btn btn-primary"
                style={{ border: "2px solid black" }}
                onClick={() => handleCardClick("healthMonitoring")}
              >
                Open
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
