import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const pgService = {
  getAll: () => api.get('/pg'),
  getById: (id) => api.get(`/pg/${id}`),
  create: (data) => api.post('/pg', data),
};

export const roomService = {
  getByPG: (pgId) => api.get(`/rooms/pg/${pgId}`),
  create: (data) => api.post('/rooms', data),
  getBeds: (roomId) => api.get(`/rooms/${roomId}/beds`),
};

export const tenantService = {
  getByPG: (pgId) => api.get(`/tenants/pg/${pgId}`),
  getMyRoom: () => api.get('/tenants/me/room'),
};

export const bookingService = {
  request: (data) => api.post('/bookings/request', data),
  getOwnerBookings: () => api.get('/bookings/owner'),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

export const paymentService = {
  getHistory: () => api.get('/payments/history'),
  createOrder: (data) => api.post('/payments/order', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
};

export const menuService = {
  getToday: (pgId) => api.get(`/menu/today/${pgId}`),
  update: (pgId, data) => api.put(`/menu/${pgId}`, data),
};

export const complaintService = {
  getAll: () => api.get('/complaints'),
  getByUser: () => api.get('/complaints/me'),
  create: (data) => api.post('/complaints', data),
  resolve: (id) => api.put(`/complaints/${id}/resolve`),
};

export const reviewService = {
  add: (data) => api.post('/reviews', data),
  getPGReviews: (pgId) => api.get(`/reviews/pg/${pgId}`),
};

export default api;
