import type { Metadata } from 'next';
import { QueryClient, dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { fetchNotes } from '../../../../../lib/api/serverApi';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] || 'all';

  const formattedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  const pageTitle = `${formattedTag} Notes | NoteHub`;
  const pageDescription = `Browse and manage your ${tag} notes efficiently on NoteHub.`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://notehub.com/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${formattedTag} Notes Banner`,
        },
      ],
    },
  };
}

const NotesPage = async ({ params }: Props) => {
  const resolvedParams = await params;
  const tag = resolvedParams.slug?.[0] || 'all';

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', tag],
    queryFn: () => fetchNotes(1, '', tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
};

export default NotesPage;
