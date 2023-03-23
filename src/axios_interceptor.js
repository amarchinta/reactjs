import axios from 'axios';

const api = axios.create({
  baseURL: 'https://example.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Call your token refresh API here and update the headers with the new token
      const newToken = await refreshToken();
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Resend the original request with the updated headers
      return api(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

const refreshToken = async () => {
  // Call your token refresh API here and return the new token
  const response = await axios.post('https://example.com/api/refresh_token');
  return response.data.token;
};

export default api;
