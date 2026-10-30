'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api/clientApi';
import { useNoteStore } from '../../lib/store/noteStore';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onClose?: () => void;
}

const tags = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const NoteForm = ({ onClose }: NoteFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes/filter/all');
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'tag') {
      setDraft({ [name]: value as any });
    } else {
      setDraft({ [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!draft.title.trim() || !draft.content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    mutation.mutate({
      title: draft.title,
      content: draft.content,
      tag: draft.tag,
    });
  };

  const handleCancel = () => {
    router.back();
    if (onClose) onClose();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.fieldWrap}>
        <label htmlFor="title" className={css.label}>
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className={css.input}
          placeholder="Enter note title"
          value={draft.title}
          onChange={handleChange}
        />
      </div>

      <div className={css.fieldWrap}>
        <label htmlFor="content" className={css.label}>
          Content
        </label>
        <textarea
          id="content"
          name="content"
          className={css.textarea}
          placeholder="Enter note content"
          value={draft.content}
          onChange={handleChange}
        />
      </div>

      <div className={css.fieldWrap}>
        <label htmlFor="tag" className={css.label}>
          Tag
        </label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          {tags.map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelBtn}
          onClick={handleCancel}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button type="submit" className={css.submitBtn} disabled={mutation.isPending}>
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
