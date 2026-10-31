'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '../../../../lib/api/clientApi';
import css from './notedetails.module.css';

const NoteDetailsClient = () => {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
    enabled: !!id,
  });

  if (isLoading) return <p suppressHydrationWarning>Loading, please wait...</p>;
  if (isError || !note) return <p suppressHydrationWarning>Something went wrong.</p>;

  return (
    <main className={css.main} suppressHydrationWarning>
      <div className={css.container} suppressHydrationWarning>
        <div className={css.headerWrap} suppressHydrationWarning>
          <h2>{note.title}</h2>
        </div>

        <span className={css.tag} suppressHydrationWarning>
          {note.tag}
        </span>

        <p className={css.content} suppressHydrationWarning>
          {note.content}
        </p>

        {}
        <div className={css.date} suppressHydrationWarning>
          {note.createdAt}
        </div>
      </div>
    </main>
  );
};

export default NoteDetailsClient;
