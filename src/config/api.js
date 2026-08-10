import { create } from 'axios';

const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL
});

export default api;