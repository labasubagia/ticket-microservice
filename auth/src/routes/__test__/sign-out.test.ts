import request from 'supertest'
import { app } from '../../app'

it('clear cookie after sign out', async () => {
  const expiresCookie = [
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  ]
  const signUpResponse = await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '12345'
    })
    .expect(201)
  expect(signUpResponse.get('Set-Cookie')).not.toEqual(expiresCookie)

  const signOutResponse = await request(app)
    .post('/api/users/sign-out')
    .send({})
    .expect(200)
  expect(signOutResponse.get('Set-Cookie')).toEqual(expiresCookie)
})
