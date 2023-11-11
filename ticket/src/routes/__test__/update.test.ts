import { mongo } from 'mongoose'
import request from 'supertest'

import { app } from '@/app'
import { ticketUpdatedPublisher } from '@/events/publishers/ticket-updated-publisher'
import { Ticket, type TicketDoc } from '@/models/ticket'

it('should not be able to access when not signed in', async () => {
  const id = new mongo.ObjectId().toString()
  await request(app).put(`/api/tickets/${id}`).send({}).expect(401)
})

it('should error validation', async () => {
  const id = new mongo.ObjectId().toString()
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.fakeSignIn())
    .send({ title: '', price: 0 })
    .expect(400)
  expect(response.body?.errors).toHaveLength(2)
})

it('should returns 404 when given id not found', async () => {
  const id = new mongo.ObjectId().toString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.fakeSignIn())
    .send({ title: 'ticket', price: 10 })
    .expect(404)
})

it(`should not be able to update other's user ticket`, async () => {
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.fakeSignIn())
    .send({ title: 'ticket', price: 10 })
    .expect(201)
  const id = createResponse.body?.id
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.fakeSignIn())
    .send({ title: 'ticket', price: 10 })
    .expect(404)
})

it(`should not be able to update when ticket already ordered`, async () => {
  const cookie = global.fakeSignIn()

  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'ticket', price: 10 })
    .expect(201)

  // order
  const id = createResponse.body?.id
  await Ticket.findByIdAndUpdate(id, {
    orderId: new mongo.ObjectId().toString()
  })

  // update
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send({ title: 'ticket', price: 10 })
    .expect(400)
})

it(`should be able to update ticket`, async () => {
  const cookie = global.fakeSignIn()
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'ticket', price: 10 })
    .expect(201)
  const id = createResponse.body?.id

  const payload = { title: 'updated', price: 20 }
  const response = await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(200)
  const ticket: TicketDoc = response.body
  expect(ticket.id).toEqual(id)
  expect(ticket.title).toEqual(payload.title)
  expect(ticket.price).toEqual(payload.price)
})

it(`emits event after update`, async () => {
  const cookie = global.fakeSignIn()
  const createResponse = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'ticket', price: 10 })
    .expect(201)
  const id = createResponse.body?.id

  const payload = { title: 'updated', price: 20 }
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send(payload)
    .expect(200)

  expect(ticketUpdatedPublisher.publish).toHaveBeenCalled()
})
