import axios from 'axios';

const API_URL = 'http://localhost:9090/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const getProfile = async (id) => {
  try {
    const response = await api.get(`/profile/${id}`);
    return response.data;
  } catch (error) {
    console.log(`Error frontend getProfile: ${error}`);
    throw error;
  }
};

export const setProfile = async (profileData) => {
  try {
    const response = await api.post('/profile/new', profileData);
    return response.data;
  } catch (error) {
    console.log(`Error setProfile frontend: ${error}`);
    throw error;
  }
};
