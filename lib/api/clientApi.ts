import { notehubApi } from './api';
import { Note } from '../../types/note';
import { User } from '../../types/user';

export interface NoteResponse {
  notes: Note[];
  totalPages: number;
  currentPage: number;
}

export interface CreateNoteInput {
  title: string;
  content: string;
  tag: string;
}

export interface UpdateUserInput {
  username: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<NoteResponse> => {
  const appliedTag = tag && tag !== 'all' ? tag : undefined;
  const response = await notehubApi.get<NoteResponse>('/notes', {
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
  const response = await notehubApi.get<Note>(`/notes/${id}`);
  return response.data;
};

export const createNote = async (note: CreateNoteInput): Promise<Note> => {
  const response = await notehubApi.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await notehubApi.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const register = async (userData: AuthCredentials): Promise<User> => {
  const response = await notehubApi.post<User>('/auth/register', userData);
  return response.data;
};

export const login = async (credentials: AuthCredentials): Promise<User> => {
  const response = await notehubApi.post<User>('/auth/login', credentials);
  return response.data;
};

export const logout = async (): Promise<{ success: boolean }> => {
  const response = await notehubApi.post<{ success: boolean }>('/auth/logout');
  return response.data;
};

export const checkSession = async (): Promise<User> => {
  const response = await notehubApi.get<User>('/auth/session');
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await notehubApi.get<User>('/users/me');
  return response.data;
};

export const updateMe = async (userData: UpdateUserInput): Promise<User> => {
  const response = await notehubApi.patch<User>('/users/me', userData);
  return response.data;
};
