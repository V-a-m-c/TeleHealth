import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path as needed

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const q = query(collection(db, 'messages'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = [];
      querySnapshot.forEach((doc) => {
        messagesData.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.role === filter;
  });

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'messages', id));
      console.log('Message deleted with ID: ', id);
    } catch (e) {
      console.error('Error deleting document: ', e);
    }
  };

  return (
    <div className="container mx-auto py-8 pt-20">
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">Messages</h2>

      <div className="flex justify-center mb-8">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 mx-2 rounded-full ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('patient')}
          className={`px-4 py-2 mx-2 rounded-full ${filter === 'patient' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          Patients
        </button>
        <button
          onClick={() => setFilter('doctor')}
          className={`px-4 py-2 mx-2 rounded-full ${filter === 'doctor' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
        >
          Doctors
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 ">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div key={msg.id} className="border-b border-gray-200 py-4 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div className="text-left">
                <p className="font-semibold"><span className="text-gray-700">Name:</span> {msg.name}</p>
                <p className="font-semibold"><span className="text-gray-700">Email:</span> {msg.email}</p>
                <p className="font-semibold"><span className="text-gray-700">Message:</span> {msg.message}</p>
                <p className="font-semibold"><span className="text-gray-700">Role:</span> {msg.role}</p>
                <p className="font-semibold"><span className="text-gray-700">Timestamp:</span> {new Date(msg.timestamp.seconds * 1000).toLocaleString()}</p>
              </div>
              <button
                onClick={() => handleDelete(msg.id)}
                className="text-white bg-red-500 hover:bg-red-700 py-2 px-4 rounded-full mt-4 md:mt-0 md:ml-4"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages found</p>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
