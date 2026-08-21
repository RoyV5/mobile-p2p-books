import api from '../config/api';

export async function searchUsers(query, token) {
  const response = await api.get('/search/users', {
    params: { q: query },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function searchBooks(query, token) {
  const response = await api.get('/search/books', {
    params: { q: query },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}