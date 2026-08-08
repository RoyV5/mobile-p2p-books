import { create } from 'axios';

const api = create({
  baseURL: 'http://192.168.68.100:5000/api',
});

export default api;