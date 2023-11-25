'use client';

import { listOrder } from '@/actions/order';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

export default function ListTicketPage() {
  const listOrderQuery = useQuery({
    queryKey: ['listOrder'],
    queryFn: listOrder,
  });

  return (
    <div className="p-4 px-8">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-xl">My Order</h1>
      </div>

      {listOrderQuery.data?.map((order) => (
        <Card key={order.id} className="mb-4">
          <CardHeader>
            <CardTitle>{order.ticket.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p>${order.ticket.price}</p>
                <p>{order.status}</p>
              </div>
              <div className="flex justify-between space-x-2">
                <Button variant={'secondary'}>
                  <Link href={`/order/${order.id}`}>Show</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
