'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { fetchNotes } from '../../../../../lib/api/clientApi';
import SearchBox from '../../../../../components/SearchBox/SearchBox';
import NoteList from '../../../../../components/NoteList/NoteList';
import Pagination from '../../../../../components/Pagination/Pagination';
import css from './notes.module.css';

interface NotesClientProps {
  tag: string;
}

const NotesClient = ({ tag }: NotesClientProps) => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    setPage(1);
  }, [tag]);

  const handleSearchDebounce = useDebouncedCallback((value: string) => {
    setDebouncedSearch(value);
    setPage(1);
  }, 300);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    handleSearchDebounce(value);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, debouncedSearch, tag),
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {data && data.totalPages > 1 && (
          <div>
            <Pagination
              pageCount={data.totalPages}
              currentPage={page}
              onChange={(newPage: number) => setPage(newPage)}
            />
          </div>
        )}
        {}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>
      <main>
        {isLoading && <p>Loading, please wait...</p>}
        {isError && <p>Something went wrong.</p>}
        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
        {data && data.notes.length === 0 && !isLoading && <p>No notes found. Create a new one!</p>}
      </main>
    </div>
  );
};

export default NotesClient;
