import request from 'supertest'

import { app } from '@/app'

it('fails when email does not exists', async () => {
  await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: '12345'
    })
    .expect(400)
})

it('fails when password incorrect', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '12345'
    })
    .expect(201)

  await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: 'invalid_password'
    })
    .expect(400)
})

it('set a cookie after successful sign in', async () => {
  await request(app)
    .post('/api/users/sign-up')
    .send({
      email: 'test@test.com',
      password: '12345'
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/sign-in')
    .send({
      email: 'test@test.com',
      password: '12345'
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
