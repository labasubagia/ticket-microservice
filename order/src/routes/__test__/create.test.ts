import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '@/app'
import { Order, OrderStatus } from '@/models/order'
import { Ticket } from '@/models/ticket'

it('returns error when user not logged in', async () => {
  const ticketId = new mongoose.Types.ObjectId()
  await request(app).post('/api/orders').send({ ticketId }).expect(401)
})

it('returns error if the ticket does not exists', async () => {
  const ticketId = new mongoose.Types.ObjectId()
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.fakeSignIn())
    .send({ ticketId })
    .expect(400)
})

it('returns error if ticket already reserved', async () => {
  const ticket = Ticket.build({ title: 'concert', price: 10 })
  await ticket.save()

  const order = Order.build({
    ticket,
    userId: '12345678',
    status: OrderStatus.Created,
    expiresAt: new Date()
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.fakeSignIn())
    .send({ ticketId: ticket.id })
    .expect(400)
})

it('reserves a ticket', async () => {
  const ticket = Ticket.build({ title: 'concert', price: 10 })
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.fakeSignIn())
    .send({ ticketId: ticket.id })
    .expect(201)
})
