'use client';

import { getCurrentUser } from '@/actions/auth';
import { detailOrder } from '@/actions/order';
import { AlertError } from '@/components/alert-error';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/order';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(0);

  const queryCurrentUser = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    networkMode: 'offlineFirst',
  });
  const { data: currentUser } = queryCurrentUser;

  const queryOrderDetail = useQuery({
    queryKey: ['orderDetail', id],
    queryFn: () => detailOrder(id),
  });
  const { data: order } = queryOrderDetail;

  const mutation = useMutation({});

  const onPay = async (order: Order) => {};

  useEffect(() => {
    if (!order) return;

    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  return (
    <>
      <h1 className="pb-2 text-xl">Order Detail</h1>

      {mutation.error && <AlertError error={mutation.error} />}

      {order && order.userId === currentUser?.id && (
        <div>
          {timeLeft > 0 ? (
            <p>Time Remaining to Pay the ticket: {timeLeft} seconds</p>
          ) : (
            <div>Order Expired</div>
          )}

          <p>{order.ticket?.title}</p>
          <p>${order.ticket?.price}</p>

          <Button
            className="mt-2"
            disabled={mutation.isPending}
            onClick={() => onPay(order as Order)}
          >
            {mutation.isPending && (
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Pay
          </Button>
        </div>
      )}
    </>
  );
}
