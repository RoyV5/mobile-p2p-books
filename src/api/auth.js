import api from '../config/api';

export async function login(email, password) {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  return response.data;
}

export async function register(email, password, handle) {
  const response = await api.post('/auth/register', {
    email,
    password,
    handle,
  });

  return response.data;
}