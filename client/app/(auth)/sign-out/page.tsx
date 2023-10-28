'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useQuery } from 'react-query';
import { AlertError } from '@/components/alert-error';
import { signOut } from '@/actions/auth';

export default function SignOut() {
  const router = useRouter();
  const { isLoading, isError, error } = useQuery('signOut', signOut, {
    onSuccess(data) {
      router.push('/');
    },
  });

  return (
    <main className={cn('p-4 px-8')}>
      {isLoading && <p>Sign In you out...</p>}
      {isError && <AlertError error={error} />}
    </main>
  );
}
