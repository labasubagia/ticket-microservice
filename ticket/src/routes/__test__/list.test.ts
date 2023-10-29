import request from 'supertest'

import { app } from '@/app'

const createTicket = async (): Promise<request.Response> => {
  return await request(app)
    .post('/api/tickets')
    .set('Cookie', global.fakeSignIn())
    .send({
      title: 'ticket',
      price: 10
    })
    .expect(201)
}

it('should be able to list all tickets', async () => {
  const n = 3
  await Promise.all(Array(n).fill(null).map(createTicket))
  const response = await request(app).get('/api/tickets')
  expect(response.status).toEqual(200)
  expect(response.body).toHaveLength(n)
})
