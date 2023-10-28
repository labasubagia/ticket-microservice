'use client';

import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from 'react-query';
import { AlertError } from '@/components/alert-error';
import { signUp } from '@/actions/auth';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(20),
});

export default function SignUp() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const mutation = useMutation(signUp);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    mutation.mutate(values, {
      onSuccess(data, variables, context) {
        router.push('/');
      },
    });
  };

  return (
    <main className={cn('p-4 px-8')}>
      <Form {...form}>
        <h1 className="text-xl">Sign Up</h1>

        {mutation.isError && <AlertError error={mutation.error} />}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Sign In</Button>
        </form>
      </Form>
    </main>
  );
}
