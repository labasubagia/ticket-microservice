import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '@/app'
import { Ticket, type TicketDoc } from '@/models/ticket'

const buildTicket = async (): Promise<TicketDoc> => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save()
  return ticket
}

it('returns error when user not logged in', async () => {
  const ticketId = new mongoose.Types.ObjectId()
  await request(app).get('/api/orders').send({ ticketId }).expect(401)
})

it('fetches order for a particular user', async () => {
  // create tickets
  const ticket1 = await buildTicket()
  const ticket2 = await buildTicket()
  const ticket3 = await buildTicket()

  // create users
  const user1 = global.fakeSignIn()
  const user2 = global.fakeSignIn()

  // order
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201)
  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201)
  const { body: order3 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201)

  // get data for user #1
  const orderRes1 = await request(app)
    .get('/api/orders')
    .set('Cookie', user1)
    .send()
    .expect(200)
  expect(orderRes1.body).toHaveLength(1)
  expect(orderRes1.body[0]?.id).toEqual(order1.id)
  expect(orderRes1.body[0]?.ticket?.id).toEqual(ticket1.id)

  // get data for user #2
  const orderRes2 = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .send()
    .expect(200)
  expect(orderRes2.body).toHaveLength(2)
  expect(orderRes2.body[0]?.id).toEqual(order2.id)
  expect(orderRes2.body[0]?.ticket?.id).toEqual(ticket2.id)
  expect(orderRes2.body[1]?.id).toEqual(order3.id)
  expect(orderRes2.body[1]?.ticket?.id).toEqual(ticket3.id)
})
