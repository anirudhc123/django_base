import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const trimmedToken = token.trim();
      config.headers.Authorization = `Bearer ${trimmedToken}`;
      console.log('Sending Authorization header:', config.headers.Authorization.slice(0, 20) + '...');
    } else {
      console.warn('No access token found');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) {
          throw new Error('No refresh token available');
        }
        const trimmedRefresh = refresh.trim();
        console.log('Attempting refresh with token:', trimmedRefresh.slice(0, 20) + '...');
        const res = await axios.post('/api/accounts/refresh/', { refresh: trimmedRefresh });
        const newAccessToken = res.data.access;
        if (!newAccessToken || !newAccessToken.includes('.')) {
          throw new Error('Invalid access token in refresh response');
        }
        localStorage.setItem('access_token', newAccessToken);
        console.log('New access token stored:', newAccessToken.slice(0, 20) + '...');
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh error:', refreshError.response?.data || refreshError.message);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default instance;