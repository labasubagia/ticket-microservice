'use client'

import { getCurrentUser } from '@/actions/auth';
import { Header } from '@/components/header';
import { useQuery } from '@tanstack/react-query';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {isLoading, data} = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    networkMode: 'offlineFirst',
  })
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
