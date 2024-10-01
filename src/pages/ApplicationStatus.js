import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import DoctorApplicationForm from '../doctors/DoctorApplicationForm'; // Corrected the import path

const ApplicationStatus = () => {
  const { currentUser } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false); // State to toggle application form

  useEffect(() => {
    const fetchApplication = async () => {
      if (currentUser) {
        console.log("Fetching application for user:", currentUser.uid); // Debugging log
        const docRef = doc(db, 'applications', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log("Application data:", docSnap.data()); // Debugging log
          setApplication(docSnap.data());
        } else {
          console.log("No application found for this user."); // Debugging log
        }
      }
      setLoading(false);
    };

    fetchApplication();
  }, [currentUser]);

  const handleReApply = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, 'applications', currentUser.uid);
      await setDoc(docRef, {
        name: '',
        email: currentUser.email,
        specialty: '',
        experience: '',
        license: '',
        livingPlace: '', // New field
        languages: '', // New field
        licensePicURL: '', // New field for license picture URL
        status: 'pending',
      });
      setShowApplicationForm(true); // Set state to show application form
    } catch (error) {
      console.error('Error re-applying:', error);
      // Handle error state or display error message
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container pt-16">
      <h1 className="my-4 text-3xl font-semibold text-center">Application Status</h1>
      {currentUser && application && (
        application.status === 'pending' ? (
          <p className="text-center text-lg">Your application is under review.</p>
        ) : application.status === 'approved' ? (
          <div className="bg-black text-white shadow-lg rounded-lg p-6 mx-auto max-w-2xl">
            <div className="text-center">
              <p className="text-2xl font-semibold text-green-400">Congratulations! Your application has been approved.</p>
              <h2 className="text-xl font-bold mt-4">Welcome, Dr. {application.name}!</h2>
              <p className="text-lg mt-2">We are thrilled to have you on board.</p>
            </div>
            <div className="mt-6 flex flex-col md:flex-row items-center space-x-4">
              <img src={application.licensePicURL} alt="Doctor's License" className="w-32 h-32 object-cover rounded-lg border-2 border-white shadow-lg" />
              <div className="mt-4 md:mt-0">
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Your Information</h3>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> {application.email}</li>
                  <li><strong>Specialty:</strong> {application.specialty}</li>
                  <li><strong>Experience:</strong> {application.experience} years</li>
                  <li><strong>License:</strong> {application.license}</li>
                  <li><strong>Living Place:</strong> {application.livingPlace}</li>
                  <li><strong>Languages:</strong> {application.languages}</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>Your application was rejected. Please re-apply:</p>
            {!showApplicationForm ? ( // Conditionally render form based on state
              <button
                className="btn btn-primary mt-4"
                onClick={handleReApply}
              >
                Re-Apply
              </button>
            ) : (
              <DoctorApplicationForm />
            )}
          </div>
        )
      )}
      {currentUser && !application && (
        <div>
          <p>As a doctor, please fill out the application form below:</p>
          <DoctorApplicationForm />
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;
