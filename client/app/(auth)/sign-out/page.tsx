'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useMutation } from 'react-query';
import { AlertError } from '@/components/alert-error';
import { signOut } from '@/actions/auth';
import { useEffect } from 'react';

export default function SignOut() {
  const router = useRouter();
  const mutation = useMutation('signOut', signOut, {
    onSuccess(data) {
      router.push('/');
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { mutation.mutate() }, [])

  return (
    <main className={cn('p-4 px-8')}>
      {mutation.isLoading && <p>Sign In you out...</p>}
      {mutation.isError && <AlertError error={mutation.error} />}
    </main>
  );
}
