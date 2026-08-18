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