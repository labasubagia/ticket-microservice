'use client';

import { getCurrentUser } from '@/actions/auth';
import { listTicket } from '@/actions/ticket';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function ListTicketPage() {
  const currentUserQuery = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    networkMode: 'offlineFirst',
  });

  const listTicketQuery = useQuery({
    queryKey: ['listTicket'],
    queryFn: listTicket,
  });

  return (
    <div className="p-4 px-8">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-xl">Tickets</h1>
      </div>

      {listTicketQuery.data?.map((ticket) => (
        <Card key={ticket.id} className="mb-4">
          <CardHeader>
            <CardTitle>{ticket.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p>${ticket.price}</p>
              <div className="flex justify-between space-x-2">
                <Button variant={'secondary'}>
                  <Link href={`/ticket/${ticket.id}`}>Detail</Link>
                </Button>
                {ticket.userId == currentUserQuery.data?.id && (
                  <Button variant={'destructive'}>
                    <Link href={`/ticket/edit/${ticket.id}`}>Edit</Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
