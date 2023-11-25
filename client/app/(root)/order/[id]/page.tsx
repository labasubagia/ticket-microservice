'use client';

import { getCurrentUser } from '@/actions/auth';
import { detailOrder } from '@/actions/order';
import { AlertError } from '@/components/alert-error';
import StripeCheckout from 'react-stripe-checkout';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PayPayload, createPayment } from '@/actions/payment';
import {
  Order,
  OrderStatus,
  getOrderExpiresDiff,
  isOrderPending,
} from '@/types/order';

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
    queryKey: ['detailOrder', id],
    queryFn: () => detailOrder(id),
  });
  const { data: order } = queryOrderDetail;

  useEffect(() => {
    if (!order) return;

    const findTimeLeft = () => {
      setTimeLeft(Math.round(getOrderExpiresDiff(order) / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  const mutation = useMutation({
    mutationFn: createPayment,
  });

  const onPaid = (payload: PayPayload) => {
    mutation.mutate(payload, {
      async onSuccess(data, variables, context) {
        await queryOrderDetail.refetch();
      },
    });
  };

  const Status: React.FC<{ order: Order }> = ({ order }) => {
    if (order.status == OrderStatus.Complete) {
      return <div>Order Already Paid</div>;
    }
    if (order.status == OrderStatus.Cancelled) {
      return <div>Order Expired</div>;
    }
    return <div>Time Remaining to Pay the ticket: {timeLeft} seconds</div>;
  };

  return (
    <>
      <h1 className="pb-2 text-xl">Order Detail</h1>

      {mutation.error && <AlertError error={mutation.error} />}

      {order && order.userId === currentUser?.id && (
        <div>
          <Status order={order} />

          <p>{order.ticket?.title}</p>
          <p>${order.ticket?.price}</p>

          {isOrderPending(order) && (
            <StripeCheckout
              token={({ id }) => onPaid({ orderId: order.id, token: id })}
              stripeKey={process.env.NEXT_PUBLIC_STRIPE_KEY as string}
              amount={order.ticket.price * 100}
              email={currentUser?.email}
            />
          )}
        </div>
      )}
    </>
  );
}
