// src/components/ClientDetails.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import CreateService from './CreateService';

const ClientDetails = ({ clientId, onBack }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewCreateService, setViewCreateService] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const docRef = doc(db, 'client', clientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setClient({ id: clientId, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching client:', error);
      }
      setLoading(false);
    };

    fetchClient();
  }, [clientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!client) {
    return <div>No client found.</div>;
  }

  return (
    <div>
      {viewCreateService ? (
        <CreateService clientId={clientId} onBack={() => setViewCreateService(false)} />
      ) : (
        <div>
          <h2>Client Details</h2>
          <p><strong>Name:</strong> {client.name}</p>
          <p><strong>Phone:</strong> {client.phone}</p>
          <p><strong>Address:</strong> {client.address}</p>

          <button onClick={onBack}>Back to Client List</button>
          <button onClick={() => setViewCreateService(true)}>Services</button>
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
