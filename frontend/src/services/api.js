import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== BOOK SEARCH ====================

export const searchBooks = async (query) => {
  const response = await api.get(`/search/books?q=${encodeURIComponent(query)}`);
  return response.data;
};

// ==================== BOOKS ====================

export const getAllBooks = async () => {
  const response = await api.get('/books');
  return response.data;
};

export const getBook = async (bookId) => {
  const response = await api.get(`/books/${bookId}`);
  return response.data;
};

export const createBook = async (bookData) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

export const updateBook = async (bookId, bookData) => {
  const response = await api.put(`/books/${bookId}`, bookData);
  return response.data;
};

export const deleteBook = async (bookId) => {
  const response = await api.delete(`/books/${bookId}`);
  return response.data;
};

// ==================== READING SESSIONS ====================

export const getBookSessions = async (bookId) => {
  const response = await api.get(`/books/${bookId}/sessions`);
  return response.data;
};

export const createSession = async (sessionData) => {
  const response = await api.post('/sessions', sessionData);
  return response.data;
};

export const deleteSession = async (sessionId) => {
  const response = await api.delete(`/sessions/${sessionId}`);
  return response.data;
};

// ==================== UTILITY ====================

export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
