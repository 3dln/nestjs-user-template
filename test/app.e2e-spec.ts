import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const userEmail = 'ashkan@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: userEmail,
        password: 'shabnashin',
      })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(userEmail);
      });
  });

  it('signs up as a new user then get the currently logged in user', async () => {
    const email = 'ario@gmail.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'shabnashin' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
