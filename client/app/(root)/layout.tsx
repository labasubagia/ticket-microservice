'use client'

import { getCurrentUser } from '@/actions/auth';
import { Header } from '@/components/header';
import { useQuery } from 'react-query';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {isLoading, data} = useQuery('currentUser', getCurrentUser)
  return (
    <>
      {isLoading ? <p>Loading...</p> : (
        <div>
          <Header currentUser={data} />
          {children}
        </div>
      )}
    </>
  );
}
