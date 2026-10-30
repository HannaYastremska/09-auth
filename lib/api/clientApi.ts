import { notehubApi } from './api';

export const fetchNotes = async (page: number, search: string, tag?: string) => {
  const appliedTag = tag && tag !== 'all' ? tag : undefined;
  const response = await notehubApi.get('/notes', {
    params: {
      page,
      perPage: 12,
      search: search || undefined,
      tag: appliedTag,
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string) => {
  const response = await notehubApi.get(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: { title: string; content: string; tag: string }) => {
  const response = await notehubApi.post('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string) => {
  const response = await notehubApi.delete(`/notes/${id}`);
  return response.data;
};

export const register = async (userData: any) => {
  const response = await notehubApi.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials: any) => {
  const response = await notehubApi.post('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await notehubApi.post('/auth/logout');
  return response.data;
};

export const checkSession = async () => {
  const response = await notehubApi.get('/auth/session');
  return response.data;
};

export const getMe = async () => {
  const response = await notehubApi.get('/users/me');
  return response.data;
};

export const updateMe = async (userData: { username: string }) => {
  const response = await notehubApi.patch('/users/me', userData);
  return response.data;
};
