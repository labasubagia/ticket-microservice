'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { signOut } from '@/actions/auth';
import { AlertError } from '@/components/alert-error';
import { cn } from '@/lib/utils';

export default function SignOut() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: signOut,
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      router.push('/');
    },
  });

  useEffect(() => {
    mutation.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className={cn('p-4 px-8')}>
      {mutation.isPending && <p>Sign In you out...</p>}
      {mutation.isError && <AlertError error={mutation.error} />}
    </main>
  );
}
