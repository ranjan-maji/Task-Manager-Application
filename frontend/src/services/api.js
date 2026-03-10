
import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to log requests (for debugging)
api.interceptors.request.use(request => {
  console.log('Starting Request:', request.method, request.url);
  return request;
});

// Add a response interceptor to normalize ID fields
api.interceptors.response.use(response => {
  // Helper function to normalize a single item
  const normalizeItem = (item) => {
    if (!item) return item;
    
    // Create a new object with all properties
    const normalized = { ...item };
    
    // Ensure id field exists (use _id from MongoDB if available)
    if (item._id && !item.id) {
      normalized.id = item._id;
    } else if (item.id && !item._id) {
      normalized._id = item.id;
    }
    
    return normalized;
  };

  // Handle different response structures
  if (response.data) {
    // Handle paginated responses
    if (response.data.tasks && Array.isArray(response.data.tasks)) {
      response.data.tasks = response.data.tasks.map(normalizeItem);
    }
    if (response.data.employees && Array.isArray(response.data.employees)) {
      response.data.employees = response.data.employees.map(normalizeItem);
    }
    
    // Handle single item responses
    if (response.data._id || response.data.id) {
      response.data = normalizeItem(response.data);
    }
    
    // Handle array responses
    if (Array.isArray(response.data)) {
      response.data = response.data.map(normalizeItem);
    }
  }
  
  console.log('Response:', response.config.url, response.status);
  return response;
}, error => {
  console.error('API Error:', error.config?.url, error.response?.status, error.response?.data);
  return Promise.reject(error);
});

// Tasks API
export const tasksApi = {
  getAll: (params) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  markCompleted: (id) => api.patch(`/tasks/${id}/complete`),
};

// Employees API
export const employeesApi = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  searchByEmail: (email) => api.get('/employees/search', { params: { email } }),
};

export default api;