// src/components/CreateClient.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, getDoc } from 'firebase/firestore';

const CreateClient = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [services, setServices] = useState([]);

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

  const fetchClientDetails = async (clientId) => {
    const docRef = doc(db, 'client', clientId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setSelectedClient({ id: clientId, ...docSnap.data() });
      fetchServices(clientId);
    } else {
      console.log('No such document!');
    }
  };

  const fetchServices = async (clientId) => {
    const querySnapshot = await getDocs(collection(db, 'service'));
    const servicesList = querySnapshot.docs
      .filter(doc => doc.data().clientId === clientId)
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    setServices(servicesList);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div>
      {selectedClient ? (
        <div>
          <h2>Client Details</h2>
          <p><strong>Name:</strong> {selectedClient.name}</p>
          <p><strong>Phone:</strong> {selectedClient.phone}</p>
          <p><strong>Address:</strong> {selectedClient.address}</p>

          <h3>Services</h3>
          {services.length > 0 ? (
            <ul>
              {services.map((service) => (
                <li key={service.id}>{service.name}</li>
              ))}
            </ul>
          ) : (
            <p>No services assigned.</p>
          )}
          <button onClick={() => setSelectedClient(null)}>Back to Client List</button>
        </div>
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
                type="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Address</label>
              <input
                type="address"
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
                  {client.name} - <button onClick={() => fetchClientDetails(client.id)}>Details</button>
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