import { cookies } from 'next/headers';
import { AxiosResponse } from 'axios';
import { notehubApi } from './api';
import { Note } from '../../types/note';
import { User } from '../../types/user';
import { NoteResponse } from './clientApi';

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
  return {
    headers: {
      Cookie: cookieString,
    },
  };
};

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<NoteResponse> => {
  const appliedTag = tag && tag !== 'all' ? tag : undefined;
  const authHeaders = await getAuthHeaders();

  const response = await notehubApi.get<NoteResponse>('/notes', {
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

export const fetchNoteById = async (id: string): Promise<Note> => {
  const authHeaders = await getAuthHeaders();
  const response = await notehubApi.get<Note>(`/notes/${id}`, authHeaders);
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const authHeaders = await getAuthHeaders();
  const response = await notehubApi.get<User>('/users/me', authHeaders);
  return response.data;
};

export const checkSession = async (): Promise<AxiosResponse<User>> => {
  const authHeaders = await getAuthHeaders();
  const response = await notehubApi.get<User>('/auth/session', authHeaders);
  return response;
};
