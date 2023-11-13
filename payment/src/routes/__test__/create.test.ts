import { mongo } from 'mongoose'
import request from 'supertest'

import { stripeId } from '@/__mocks__/stripe'
import { app } from '@/app'
import { paymentCreatedPublisher } from '@/events/publishers/payment-created-publisher'
import { Order, OrderStatus } from '@/models/order'
import { Payment } from '@/models/payment'
import { stripe } from '@/stripe'

it('returns 401 when access unauthorized', async () => {
  await request(app).post('/api/payments').expect(401)
})

it('returns 404 when order not found', async () => {
  const orderId = new mongo.ObjectId().toString()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.fakeSignIn())
    .send({ token: 'token', orderId })
    .expect(404)
})

it('returns 404 when order exists but not owned by user', async () => {
  const order = Order.build({
    id: new mongo.ObjectId().toString(),
    price: 10,
    status: OrderStatus.Created,
    userId: new mongo.ObjectId().toString(),
    version: 0
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.fakeSignIn())
    .send({ token: 'token', orderId: order.id })
    .expect(404)
})

it('returns 400 when purchasing cancelled order', async () => {
  const order = Order.build({
    id: new mongo.ObjectId().toString(),
    price: 10,
    status: OrderStatus.Cancelled,
    userId: new mongo.ObjectId().toString(),
    version: 0
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.fakeSignIn(order.userId))
    .send({ token: 'token', orderId: order.id })
    .expect(400)
})

it('create payment charge', async () => {
  const order = Order.build({
    id: new mongo.ObjectId().toString(),
    price: 10,
    status: OrderStatus.Created,
    userId: new mongo.ObjectId().toString(),
    version: 0
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.fakeSignIn(order.userId))
    .send({ token: 'tok_visa', orderId: order.id })
    .expect(200)

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  expect(chargeOptions?.source).toEqual('tok_visa')
  expect(chargeOptions?.amount).toEqual(order.price * 100)
  expect(chargeOptions?.currency).toEqual('usd')

  const payment = await Payment.findOne({ orderId: order.id, stripeId })
  expect(payment?.orderId).toEqual(order.id)
  expect(payment?.stripeId).toEqual(stripeId)

  expect(paymentCreatedPublisher.publish).toHaveBeenCalled()

  const eventData = (paymentCreatedPublisher.publish as jest.Mock).mock
    .calls?.[0]?.[0]
  expect(eventData?.id).toEqual(payment?.id)
  expect(eventData?.orderId).toEqual(payment?.orderId)
  expect(eventData?.stripeId).toEqual(payment?.stripeId)
})
