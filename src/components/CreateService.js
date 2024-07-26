// src/components/CreateService.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const CreateService = ({ clientId, onBack }) => {
  const [dateTime, setDateTime] = useState('');
  const [deepClean, setDeepClean] = useState(false);
  const [services, setServices] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'service'), {
        clientId,
        dateTime,
        deepClean,
      });
      // console.log('Document written with ID: ', docRef.id);
      setDateTime('');
      setDeepClean(false);
      fetchServices();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const fetchServices = async () => {
    const q = query(collection(db, 'service'), where('clientId', '==', clientId));
    const querySnapshot = await getDocs(q);
    const servicesList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setServices(servicesList);
  };

  useEffect(() => {
    fetchServices();
  }, [clientId]);

  return (
    <div>
      <h2>Create Service</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date and Time</label>
          <input
            type="text"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Deep Clean</label>
          <input
            type="checkbox"
            checked={deepClean}
            onChange={(e) => setDeepClean(e.target.checked)}
          />
        </div>
        <button type="submit">Add Service</button>
      </form>

      <h3>Service List</h3>
      {services.length > 0 ? (
        <ul>
          {services.map((service) => (
            <li key={service.id}>
              {service.dateTime} - {service.deepClean ? 'Deep Clean' : 'Standard Clean'}
            </li>
          ))}
        </ul>
      ) : (
        <p>No services available.</p>
      )}

      <button onClick={onBack}>Back to Client Details</button>
    </div>
  );
};

export default CreateService;