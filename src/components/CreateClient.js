// src/components/CreateClient.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import ClientDetails from './ClientDetails';

const CreateClient = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, 'client'), {
        name,
        phone,
        address,
      });
      console.log('Document written with ID: ', docRef.id);
      setName('');
      setPhone('');
      setAddress('');
      fetchClients();
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const fetchClients = async () => {
    const querySnapshot = await getDocs(collection(db, 'client'));
    const clientsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setClients(clientsList);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div>
      {selectedClient ? (
        <ClientDetails clientId={selectedClient.id} onBack={() => setSelectedClient(null)} />
      ) : (
        <div>
          <h2>Create Client</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <button type="submit">Add Client</button>
          </form>

          <h3>Client List</h3>
          {clients.length > 0 ? (
            <ul>
              {clients.map((client) => (
                <li key={client.id}>
                  {client.name} - <button onClick={() => setSelectedClient(client)}>Details</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No clients available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreateClient;

