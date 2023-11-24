'use client';

import { getCurrentUser } from '@/actions/auth';
import { createOrder } from '@/actions/order';
import { detail } from '@/actions/ticket';
import { AlertError } from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/order';
import { Ticket } from '@/types/ticket';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';

export default function TicketDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();

  const queryCurrentUser = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    networkMode: 'offlineFirst',
  });
  const { data: currentUser } = queryCurrentUser;

  const queryTicketDetail = useQuery({
    queryKey: ['ticketDetail', id],
    queryFn: () => detail(id),
  });
  const { data: ticket } = queryTicketDetail;

  const mutation = useMutation({
    mutationFn: (ticketId: string) => createOrder(ticketId),
  });

  const onPurchase = async (ticket: Ticket) => {
    mutation.mutate(ticket.id, {
      onSuccess(order, variables, context) {
        router.push(`/order/${order?.id}`);
      },
    });
  };

  return (
    <>
      <h1 className="pb-2 text-xl">Detail Ticket</h1>

      {mutation.error && <AlertError error={mutation.error} />}

      {ticket && ticket.userId !== currentUser?.id && (
        <div>
          <p>{ticket.title}</p>
          <p>${ticket.price}</p>

          <Button
            className="mt-2"
            disabled={mutation.isPending}
            onClick={() => onPurchase(ticket as Ticket)}
          >
            {mutation.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Purchase
          </Button>
        </div>
      )}
    </>
  );
}
