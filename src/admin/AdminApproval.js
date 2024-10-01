import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const AdminApproval = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'applications'));
        const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(apps);
      } catch (err) {
        setError('Failed to fetch applications. Please try again.');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleApproval = async (id, status) => {
    try {
      setLoading(true);
      const docRef = doc(db, 'applications', id);
      await updateDoc(docRef, { status });
      setApplications(prevApplications =>
        prevApplications.map(app => (app.id === id ? { ...app, status } : app))
      );
    } catch (err) {
      setError('Failed to update application status. Please try again.');
      console.error('Error updating application status:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadLicense = (url) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'license_image'); // Set the filename for download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up: remove the link from the body
  };

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen pt-16 md:pt-20 px-5">
      <h2 className="mb-4 text-xl md:text-2xl">Doctor Applications</h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Specialty</th>
              <th className="px-4 py-2">Experience</th>
              <th className="px-4 py-2">License Number</th>
              <th className="px-4 py-2">License Picture</th>
              <th className="px-4 py-2">Living Place</th>
              <th className="px-4 py-2">Languages</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map(app => (
              <tr key={app.id}>
                <td className="px-4 py-2">{app.name}</td>
                <td className="px-4 py-2">{app.email}</td>
                <td className="px-4 py-2">{app.specialty}</td>
                <td className="px-4 py-2">{app.experience}</td>
                <td className="px-4 py-2">{app.license}</td>
                <td className="px-4 py-2">
                  {app.licensePicURL && (
                    <>
                      <img src={app.licensePicURL} alt="License" className="h-16 w-16 object-cover mb-2" />
                      <div>
                        <button
                          className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                          onClick={() => downloadLicense(app.licensePicURL)}
                        >
                          Download
                        </button>
                      </div>
                    </>
                  )}
                </td>
                <td className="px-4 py-2">{app.livingPlace}</td>
                <td className="px-4 py-2">{app.languages}</td>
                <td className="px-4 py-2">
                  {app.status === 'pending' && (
                    <>
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded mr-2"
                        onClick={() => handleApproval(app.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={() => handleApproval(app.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {app.status === 'approved' && <span className="text-green-500">Approved</span>}
                  {app.status === 'rejected' && <span className="text-red-500">Rejected</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApproval;
