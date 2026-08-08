import api from '../config/api';

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getMyShelf(token) {
  const response = await api.get('/shelf/books', {
    headers: authHeaders(token),
  });

  return response.data;
}

export async function addBook(isbn, token) {
  const response = await api.post(
    '/shelf/books',
    { isbn },
    {
      headers: authHeaders(token),
    }
  );

  return response.data;
}

export async function deleteBook(isbn, token) {
  await api.delete(`/shelf/books/${isbn}`, {
    headers: authHeaders(token),
  });
}