'use client';

import { TicketPayload, detail, update } from '@/actions/ticket';
import { AlertError } from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(3),
  price: z.coerce.number().positive(),
});

export default function EditTicketPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      price: 0,
    },
  });

  const query = useQuery({
    queryKey: ['detailTicker', id],
    queryFn: () => detail(id),
  });

  useEffect(() => {
    if (!query.data) return;
    form.setValue('title', query.data.title);
    form.setValue('price', query.data.price);
  }, [query.data]);

  const mutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: TicketPayload;
    }) => update(id, payload),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate(
      { id: id as string, payload: values },
      {
        onSuccess(data, variables, context) {
          router.push('/');
          form.reset();
        },
      },
    );
  };

  return (
    <div className={cn('p-4 px-8')}>
      <Form {...form}>
        <h1 className="pb-4 text-xl">Update Ticket</h1>

        {mutation.isError && <AlertError error={mutation.error} />}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Concert Ticket #112" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="5" type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Save</Button>
        </form>
      </Form>
    </div>
  );
}
