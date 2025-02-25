import React, { useState, useEffect } from 'react';
import { api } from '../../AxiosInstance'; // Adjust the import path based on where your Axios instance is located
import 'bootstrap/dist/css/bootstrap.min.css';
import Particle from "../Particle"; // Import Bootstrap CSS

const ContactList = () => {
    const [contacts, setContacts] = useState([]);
    const [error, setError] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null); // For displaying reason in modal

    useEffect(() => {
        // Fetch contacts on component mount using axios instance
        const fetchContacts = async () => {
            try {
                const response = await api.get('/Contact'); // Use your API endpoint to fetch contacts
                setContacts(response.data);
            } catch (err) {
                setError('Failed to fetch contacts: ' + err.message);
            }
        };

        fetchContacts();
    }, []);

    const deleteContact = async (id) => {
        try {
            const response = await api.delete(`/Contact/${id}`); // Use your API endpoint for deleting a contact
            // Remove the contact from the state after successful deletion
            setContacts(contacts.filter(contact => contact.id !== id));
        } catch (err) {
            setError('Failed to delete contact: ' + err.message);
        }
    };

    // Function to handle the modal visibility
    const showReason = (contact) => {
        setSelectedContact(contact);
    };

    const closeModal = () => {
        setSelectedContact(null);
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 ">
            <Particle/>
            <div className="container text-white overflow-auto" style={{ maxHeight: '80vh' }}>
                <h1 className="mb-4">Contact List</h1>
                {error && <div className="alert alert-danger">{error}</div>}

                <table className="table table-bordered">
                    <thead>
                    <tr>
                        <th className="text-white">Contact Name</th>
                        <th className="text-white">Email</th>
                        <th className="text-white">Reason</th>
                        <th className="text-white">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {contacts.length > 0 ? (
                        contacts.map(contact => (
                            <tr key={contact.id}>
                                <td className="text-white">{contact.name}</td>
                                <td className="text-white">{contact.email}</td>
                                <td>
                                    <button className="btn btn-info btn-sm" onClick={() => showReason(contact)}>
                                        View Reason
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => deleteContact(contact.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="text-center">No contacts available</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {/* Modal for displaying the reason */}
                {selectedContact && (
                    <div className="modal show" style={{ display: 'block' }} onClick={closeModal}>
                        <div className="modal-dialog" onClick={e => e.stopPropagation()}>
                            <div className="modal-content bg-dark">
                                <div className="modal-header">
                                    <h5 className="modal-title">Reason for Contact</h5>
                                    <button type="button" className="close" onClick={closeModal}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p><strong>Name:</strong> {selectedContact.name}</p>
                                    <p><strong>Email:</strong> {selectedContact.email}</p>
                                    <p><strong>Reason:</strong> {selectedContact.reason}</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactList;
