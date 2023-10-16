import request from "supertest";
import { app } from "../../app";

it('respond with detail of current user', async () => {
    const cookie = await globalThis.signUp()
    const response = await request(app)
        .get('/api/users/current-user')
        .set('Cookie', cookie)
        .send()
        .expect(200)
    expect(response.body?.currentUser?.email).toEqual("test@test.com")
})