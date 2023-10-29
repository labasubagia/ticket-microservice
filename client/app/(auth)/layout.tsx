'use client';

import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/actions/auth';
import { Header } from '@/components/header';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    networkMode: 'offlineFirst',
  });
  return (
    <>
      <Header currentUser={data} />
      <div className="container mx-auto py-8">{children}</div>
    </>
  );
}
