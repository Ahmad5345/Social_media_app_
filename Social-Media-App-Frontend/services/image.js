import axios from 'axios';

const API_BASE = 'http://192.168.0.46:9090/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const uploadImage = async (photoUri) => {
  const formData = new FormData();

  formData.append('image', {
    uri: photoUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  });

  const res = await api.post('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getImageUrl = (imageId) => {
  if (!imageId) return null;
  return `${API_BASE}/images/${imageId}`;
};

export const deleteImage = async (imageId) => {
  const res = await api.delete(`/images/${imageId}`);
  return res.data;
};
