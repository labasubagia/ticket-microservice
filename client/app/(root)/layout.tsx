'use client';

import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '@/actions/auth';
import { Header } from '@/components/header';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    networkMode: 'offlineFirst',
  });

  const isAllowed = () => {
    const guestPaths = ['', '/'];
    return !guestPaths.includes(path) && !currentUser;
  };

  useEffect(() => {
    if (isAllowed()) router.push('/');
  }, [currentUser]);

  return (
    <>
      <Header currentUser={currentUser} />
      {!isAllowed() && <div className="container mx-auto py-8">{children}</div>}
    </>
  );
}
