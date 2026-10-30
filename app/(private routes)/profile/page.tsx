import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '../../../lib/api/serverApi';
import css from './page.module.css';

export const metadata: Metadata = {
  title: 'My Profile | NoteHub',
  description: 'View and manage your NoteHub profile information.',
  openGraph: {
    title: 'My Profile | NoteHub',
    description: 'View and manage your NoteHub profile information.',
    url: 'https://notehub.com',
    images: [
      {
        url: 'https://goit.global',
        width: 1200,
        height: 630,
        alt: 'Profile Page Banner',
      },
    ],
  },
};

export default async function ProfilePage() {
  let user = { username: 'Guest', email: '', avatar: 'https://goit.global' };

  try {
    user = await getMe();
  } catch (error) {
    console.error('Failed to fetch user profile on server:', error);
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          {}
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user.avatar || 'https://goit.global'}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
            priority
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}
