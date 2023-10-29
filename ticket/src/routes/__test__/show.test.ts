import request from 'supertest'

import { app } from '@/app'
import { type TicketDoc } from '@/models/ticket'

it('should be a routes to handle GET /api/tickets/:id', async () => {
  const response = await request(app).get('/api/tickets/INVALID_ID').send()
  expect(response.status).not.toEqual(404)
})

it('should be able to get ticket', async () => {
  const cookie = global.fakeSignIn()

  // create ticket
  const payload = { title: 'football ticket', price: 10 }
  const resCreate = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send(payload)
    .expect(201)
  const id = resCreate.body?.id

  // show ticket
  const resShow = await request(app)
    .get(`/api/tickets/${id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200)
  const ticket: TicketDoc = resShow.body
  expect(ticket).not.toBeNull()
  expect(ticket.id).toEqual(id)
  expect(ticket.title).toEqual(payload.title)
  expect(ticket.price).toEqual(payload.price)
})
