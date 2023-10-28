import { app } from '@/app'
import request from 'supertest'

it('respond with detail of current user', async () => {
  const cookie = await globalThis.signUp()
  const response = await request(app)
    .get('/api/users/current-user')
    .set('Cookie', cookie)
    .send()
    .expect(200)
  expect(response.body?.currentUser?.email).toEqual('test@test.com')
})

it('returns a 401 when no cookie provided', async () => {
  await request(app).get('/api/users/current-user').send().expect(401)
})
