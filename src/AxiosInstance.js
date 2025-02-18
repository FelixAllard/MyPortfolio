import axios from 'axios';
import Cookies from 'js-cookie';

// Function to get the token from cookies
const getToken = () => Cookies.get('authToken');

// Create an Axios instance with the base URL and credentials configured
const api = axios.create({
    baseURL: 'http://localhost:5171/api', // Adjust your base URL as needed
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
    },
});

// Interceptor to dynamically set the Authorization header on each request
api.interceptors.request.use(config => {
    const token = getToken();
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

// Function to make requests with a method, URL, and optional data (body)
const makeRequest = async (method, url, data = null) => {
    try {
        const response = await api({
            method,
            url,
            data,
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error making request:', error.response || error);
        throw error;
    }
};

// Function to check if the user is logged in
const isLoggedIn = () => {
    return !!getToken(); // Returns true if a token exists, false otherwise
};

// Login function that stores the token in a cookie
const login = async (username, password) => {
    const loginData = { UserName: username, Password: password };
    const response = await makeRequest('POST', '/Auth/login', loginData);
    if (response.token) {
        Cookies.set('authToken', response.token, { expires: 7, secure: true }); // Store token in cookie with expiry
    }
    return response;
};

// Register function
const register = async (username, email, password) => {
    const registerData = { UserName: username, Email: email, Password: password };
    return await makeRequest('POST', '/Auth/register', registerData);
};

// Logout function to clear the token
const logout = () => {
    Cookies.remove('authToken');
};

export { api, makeRequest, login, register, isLoggedIn, logout };
