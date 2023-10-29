import request from 'supertest'

import { app } from '@/app'
import { Ticket } from '@/models/ticket'

it('has a route handler listening to POST /api/tickets', async () => {
  const response = await request(app).post('/api/tickets').send()
  expect(response.status).not.toEqual(404)
})

it('only can be accessed when signed in', async () => {
  await request(app).post('/api/tickets').send().expect(401)
})

it('returns other than 401 when signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.fakeSignIn())
    .send()
  expect(response.status).not.toEqual(401)
})

it('returns error if invalid title provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.fakeSignIn())
    .send({
      title: '',
      price: 200
    })
    .expect(400)
})

it('returns error if invalid price provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.fakeSignIn())
    .send({
      title: 'football match',
      price: 0
    })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  let tickets = await Ticket.find({})
  expect(tickets).toHaveLength(0)

  const payload = { title: 'football match', price: 200 }

  await request(app)
    .post('/api/tickets')
    .set('Cookie', global.fakeSignIn())
    .send(payload)
    .expect(201)

  tickets = await Ticket.find({})
  expect(tickets).toHaveLength(1)
  expect(tickets[0].title).toEqual(payload.title)
  expect(tickets[0].price).toEqual(payload.price)
})
