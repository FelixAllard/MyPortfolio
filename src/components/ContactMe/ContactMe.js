import React, { useState } from 'react';
import { makeRequest } from "../../AxiosInstance";
import {useTranslation} from "react-i18next"; // Importing your configured Axios instance

function ContactMe() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const { t } = useTranslation("contactMe");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!name || !email || !reason) {
            setError('All fields must be filled out.');
            return;
        }

        // Simple email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        const askingForContact = { name, email, reason };

        try {
            // Using makeRequest to send the POST request to your API
            await makeRequest('POST', '/Contact', askingForContact);  // Adjusted URL as per your backend API route
            alert('Thank you for contacting us!');
            setName('');
            setEmail('');
            setReason('');
            setError('');
        } catch (err) {
            setError('There was an error sending your request. Please try again later.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="bg-dark p-4 rounded shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white' }}>
                        <h2 className="text-center mb-4">{t('contact_us')}</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">{t('name')}</label>
                                <input
                                    type="text"
                                    className="form-control bg-transparent border-light text-white"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">{t('email')}</label>
                                <input
                                    type="email"
                                    className="form-control bg-transparent border-light text-white"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reason" className="form-label">{t('contact_reason')}</label>
                                <textarea
                                    className="form-control bg-transparent border-light text-white"
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows="4"
                                    required
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                                ></textarea>
                            </div>
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-primary">{t('submit')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ContactMe;
