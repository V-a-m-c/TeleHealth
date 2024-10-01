import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db,storage} from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Select from 'react-select';

const indianLanguages = [
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Urdu', label: 'Urdu' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Malayalam', label: 'Malayalam' },
  { value: 'Odia', label: 'Odia' },
  { value: 'Punjabi', label: 'Punjabi' },
  { value: 'Assamese', label: 'Assamese' },
  { value: 'Maithili', label: 'Maithili' },
  { value: 'Sanskrit', label: 'Sanskrit' },
  { value: 'English', label: 'English' },
  // Add more Indian languages as needed
];

const specialties = [
  { value: 'Allergy and Immunology', label: 'Allergy and Immunology' },
  { value: 'Anesthesiology', label: 'Anesthesiology' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Emergency Medicine', label: 'Emergency Medicine' },
  { value: 'Endocrinology', label: 'Endocrinology' },
  { value: 'Family Medicine', label: 'Family Medicine' },
  { value: 'Gastroenterology', label: 'Gastroenterology' },
  { value: 'Geriatrics', label: 'Geriatrics' },
  { value: 'Hematology', label: 'Hematology' },
  { value: 'Infectious Disease', label: 'Infectious Disease' },
  { value: 'Internal Medicine', label: 'Internal Medicine' },
  { value: 'Nephrology', label: 'Nephrology' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Obstetrics and Gynecology', label: 'Obstetrics and Gynecology' },
  { value: 'Oncology', label: 'Oncology' },
  { value: 'Ophthalmology', label: 'Ophthalmology' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Otolaryngology', label: 'Otolaryngology' },
  { value: 'Pathology', label: 'Pathology' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Physical Medicine and Rehabilitation', label: 'Physical Medicine and Rehabilitation' },
  { value: 'Plastic Surgery', label: 'Plastic Surgery' },
  { value: 'Psychiatry', label: 'Psychiatry' },
  { value: 'Pulmonology', label: 'Pulmonology' },
  { value: 'Radiology', label: 'Radiology' },
  { value: 'Rheumatology', label: 'Rheumatology' },
  { value: 'Surgery', label: 'Surgery' },
  { value: 'Urology', label: 'Urology' }
  // Add more specialties as needed
];

const DoctorApplicationForm = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState('pending'); // Default status
  const [licensePic, setLicensePic] = useState(null);
  const nameRef = useRef();
  const emailRef = useRef();
  const experienceRef = useRef();
  const licenseRef = useRef();
  const livingPlaceRef = useRef();
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    async function fetchApplicationStatus() {
      try {
        const docRef = doc(db, 'applications', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const { status } = docSnap.data();
          setApplicationStatus(status);
        } else {
          setApplicationStatus('pending');
        }
      } catch (error) {
        console.error('Error fetching application status:', error);
      }
    }

    fetchApplicationStatus();
  }, [currentUser.uid]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file && allowedTypes.includes(file.type)) {
      setLicensePic(file);
      setError('');
    } else {
      setLicensePic(null);
      setError('Please upload a valid image file (JPEG, JPG, PNG, GIF).');
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const specialty = selectedSpecialty?.value;
    const experience = parseInt(experienceRef.current.value.trim(), 10);
    const license = licenseRef.current.value.trim();
    const livingPlace = livingPlaceRef.current.value.trim();
    const languages = selectedLanguages.map(lang => lang.value).join(', ');

    if (!name || !email || !specialty || isNaN(experience) || experience < 0 || !license || !livingPlace || !languages || !licensePic) {
      setError('Please fill in all fields correctly and upload a valid image file.');
      return;
    }

    try {
      setLoading(true);

      const storageRef = ref(storage, `licenses/${currentUser.uid}`);
      await uploadBytes(storageRef, licensePic);
      const licensePicURL = await getDownloadURL(storageRef);

      const docRef = doc(db, 'applications', currentUser.uid);
      await setDoc(docRef, {
        name,
        email,
        specialty,
        experience,
        license,
        licensePicURL,
        livingPlace,
        languages,
        status: 'pending',
      });

      setSuccess(true);
      setApplicationStatus('pending');
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit application. Please try again.');
    }

    setLoading(false);
  }

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <h1 className="card-title text-center mb-4">Doctor Application Form</h1>
        {error && <p className="text-danger">{error}</p>}
        {success && (
          <div className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800" role="alert">
            <div className="flex items-center">
              <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
              </svg>
              <span className="sr-only">Info</span>
              <h3 className="text-lg font-medium">Your Application is Successfully Received</h3>
            </div>
            <div className={`mt-2 mb-4 ${showMore ? 'block' : 'hidden'}`}>
              <p className="text-sm text-green-700 dark:text-green-400">Your application has been submitted successfully.</p>
              <p className="text-sm text-green-700 dark:text-green-400">Please wait for admin approval. You can check the status in your dashboard.</p>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setShowMore(!showMore)} className="text-sm font-medium text-green-800 dark:text-green-400 focus:outline-none focus:underline">
                {showMore ? 'Dismiss' : 'See More'}
              </button>
            </div>
          </div>
        )}
        {applicationStatus === 'rejected' && (
          <div className="mb-3">
            <p className="text-danger">Your previous application has been rejected.</p>
            <p>Please re-apply with correct information.</p>
          </div>
        )}
        {applicationStatus !== 'approved' && (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input type="text" className="form-control" id="name" ref={nameRef} placeholder="Enter your full name" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email address</label>
              <input type="email" className="form-control" id="email" ref={emailRef} defaultValue={currentUser.email} readOnly required />
            </div>
            <div className="mb-3">
              <label htmlFor="specialty" className="form-label">Specialty</label>
              <Select
                options={specialties}
                className="basic-single"
                classNamePrefix="select"
                value={selectedSpecialty}
                onChange={setSelectedSpecialty}
                placeholder="Select specialty"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="experience" className="form-label">Years of Experience</label>
              <input type="number" className="form-control" id="experience" ref={experienceRef} min="0" placeholder="e.g. 10" required />
            </div>
            <div className="mb-3">
              <label htmlFor="license" className="form-label">License Number</label>
              <input type="text" className="form-control" id="license" ref={licenseRef} placeholder="e.g. APMC123456" required />
            </div>
            <div className="mb-3">
              <label htmlFor="licensePic" className="form-label">Upload Clarity Picture of your License</label>
              <input type="file" className="form-control" id="licensePic" onChange={handleChange} accept="image/jpeg, image/png, image/gif" required />
            </div>
            <div className="mb-3">
              <label htmlFor="livingPlace" className="form-label">Place of Living</label>
              <input type="text" className="form-control" id="livingPlace" ref={livingPlaceRef} placeholder="e.g. Hyderabad" required />
            </div>
            <div className="mb-3">
              <label htmlFor="languages" className="form-label">Languages Spoken</label>
              <Select
                isMulti
                options={indianLanguages}
                className="basic-multi-select"
                classNamePrefix="select"
                value={selectedLanguages}
                onChange={setSelectedLanguages}
                placeholder="Select languages"
              />
            </div>
            <div className="d-grid">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
        {applicationStatus === 'approved' && (
          <p className="text-success">Your application has been approved.</p>
        )}
      </div>
    </div>
  );
};

export default DoctorApplicationForm;
