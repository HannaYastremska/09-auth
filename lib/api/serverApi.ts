import { cookies } from 'next/headers';
import { notehubApi } from './api';

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  return {
    headers: {
      Cookie: cookieString,
    },
  };
};

export const fetchNotes = async (page: number, search: string, tag?: string) => {
  const appliedTag = tag && tag !== 'all' ? tag : undefined;
  const authHeaders = await getAuthHeaders();

  const response = await notehubApi.get('/notes', {
    ...authHeaders,
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
  const authHeaders = await getAuthHeaders();
  const response = await notehubApi.get(`/notes/${id}`, authHeaders);
  return response.data;
};

export const getMe = async () => {
  const authHeaders = await getAuthHeaders();
  const response = await notehubApi.get('/users/me', authHeaders);
  return response.data;
};

export const checkSession = async () => {
  const authHeaders = await getAuthHeaders();
  const response = await notehubApi.get('/auth/session', authHeaders);
  return response.data;
};
