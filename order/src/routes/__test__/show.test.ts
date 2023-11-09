import mongoose from 'mongoose'
import request from 'supertest'

import { app } from '@/app'
import { Ticket } from '@/models/ticket'

it('returns error when user not logged in', async () => {
  const orderId = new mongoose.Types.ObjectId().toString()
  await request(app).get(`/api/orders/${orderId}`).send().expect(401)
})

it('returns error not found when no order exists', async () => {
  const orderId = new mongoose.Types.ObjectId().toString()
  await request(app)
    .get(`/api/orders/${orderId}`)
    .set('Cookie', global.fakeSignIn())
    .send()
    .expect(404)
})

it('returns error not found when it is not user data', async () => {
  const ticket = Ticket.build({ title: 'concert', price: 200 })
  await ticket.save()
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', global.fakeSignIn())
    .send({ ticketId: ticket.id })
    .expect(201)

  await request(app)
    .get(`/api/orders/${order?.id}`)
    .set('Cookie', global.fakeSignIn())
    .send()
    .expect(404)
})

it('returns order', async () => {
  const cookie = global.fakeSignIn()

  const ticket = Ticket.build({ title: 'concert', price: 200 })
  await ticket.save()
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201)
  const response = await request(app)
    .get(`/api/orders/${order?.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)
  expect(response.body?.id).toEqual(order?.id)
  expect(response.body?.ticket?.id).toEqual(ticket?.id)
})
