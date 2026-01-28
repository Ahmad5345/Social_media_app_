import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:9090/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT manually (since this file is standalone)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;


/**
 * Create profile for the authenticated user
 * userId comes from JWT on backend
 */
export const setProfile = async (profileData) => {
  try {
    const res = await api.post('/profile/new', profileData);
    return res.data;
  } catch (err) {
    console.error(
      'setProfile failed:',
      err.response?.status,
      err.response?.data,
    );
    throw err;
  }
};

/**
 * Fetch profile by userId
 */
export const getProfile = async (userId) => {
  try {
    const res = await api.get(`/profile/${userId}`);
    return res.data;
  } catch (err) {
    console.error(
      'getProfile failed:',
      err.response?.status,
      err.response?.data,
    );
    throw err;
  }
};
