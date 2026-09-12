import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Packages
export const getPackages = (params = {}) => api.get('/packages', { params });
export const getFeaturedPackages = () => api.get('/packages', { params: { featured: 'true' } });
export const getPackageById = (id) => api.get(`/packages/${id}`);
export const searchPackages = (searchParams) => api.get('/packages', { params: searchParams });

// Destinations
export const getDestinations = (params = {}) => api.get('/destinations', { params });
export const getDestinationById = (id) => api.get(`/destinations/${id}`);

// Testimonials
export const getTestimonials = () => api.get('/testimonials');

// Enquiries & Contact
export const submitEnquiry = (data) => api.post('/enquiries', data);
export const submitContact = (data) => api.post('/contact', data);

export default api;
