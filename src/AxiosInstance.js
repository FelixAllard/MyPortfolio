import axios from 'axios';

// Create an Axios instance with the base URL and credentials configured
const api = axios.create({
    baseURL: 'http://localhost:5171/api', // Adjust your base URL as needed
    withCredentials: true, // Send cookies with the request
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to make requests with a method, URL, and optional data (body)
const makeRequest = async (method, url, data = null) => {
    try {
        const response = await api({
            method,          // Request method (GET, POST, etc.)
            url,             // The endpoint URL
            data,            // Request body (optional)
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error making request:', error.response || error);
        throw error;
    }
};

// Function to check if the user is logged in by checking for the cookie
const isLoggedIn = () => {
    const cookies = document.cookie.split(';');
    // Check if the authentication cookie is present
    const isAuthenticated = cookies.some(cookie => cookie.trim().startsWith('.AspNetCore.Identity.Application='));
    return isAuthenticated;
};

// Example usage:
const login = async (username, password) => {
    const loginData = { UserName: username, Password: password };
    return await makeRequest('POST', '/Auth/login', loginData);
};

// Example usage:
const register = async (username, email, password) => {
    const registerData = { UserName: username, Email: email, Password: password };
    return await makeRequest('POST', '/Auth/register', registerData);
};

export { api, makeRequest, login, register, isLoggedIn };
