import request from "supertest";
import { app } from "../../app";

it('respond with detail of current user', async () => {
    const authResponse = await request(app)
        .post('/api/users/sign-up')
        .send({
            email: "test@test.com",
            password: "12345"
        })
        .expect(201)
    const cookie = authResponse.get('Set-Cookie')

    const response = await request(app)
        .get('/api/users/current-user')
        .set('Cookie', cookie)
        .send()
        .expect(200)
    expect(response.body?.currentUser?.email).toEqual("test@test.com")
})