import request from "supertest";
import { app } from "../../app";

it('returns a 201 on successful sign up', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
})

it('returns a 400 on with invalid email', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'invalid_email',
            password: 'password'
        })
        .expect(400)
})

it('returns a 400 on with short password', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({
            email: 'test@test.com',
            password: '12'
        })
        .expect(400)
})

it('returns a 400 on with invalid input', async () => {
    return request(app)
        .post('/api/users/sign-up')
        .send({})
        .expect(400)
})

it('returns a 400 on with missing email and password', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: "test@test.com"
        })
        .expect(400)

    await request(app)
        .post('/api/users/sign-up')
        .send({
            password: "1234"
        })
        .expect(400)
})

it('disallows duplicate emails', async () => {
    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: "test@test.com",
            password: "12345"
        })
        .expect(201)

    await request(app)
        .post('/api/users/sign-up')
        .send({
            email: "test@test.com",
            password: "12345"
        })
        .expect(400)
})

it('set a cookie after successful sign up', async () => {
    const response = await request(app)
        .post('/api/users/sign-up')
        .send({
            email: "test@test.com",
            password: "12345"
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined()
})