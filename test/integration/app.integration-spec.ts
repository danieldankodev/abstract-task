import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Integration test', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET) Should succeed with 200', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/admin (GET) Should succeed with 200', () => {
    return request(app.getHttpServer())
      .get('/admin')
      .expect(200)
      .expect('Hello World!');
  });

  it('/admin/settings (GET) Should fail with 401', () => {
    return request(app.getHttpServer())
      .get('/admin/settings')
      .expect(401)
      .expect({ statusCode: 401, message: 'Not Authorized!' });
  });

  it('/admin/settings (GET) Should succeed with 200', () => {
    return request(app.getHttpServer())
      .get('/admin/settings')
      .set({ 'user-id': '1' })
      .set({ 'x-forwarded-for': '100.100.100.100' })
      .expect(200)
      .expect('Hello World!');
  });

  it('/admin/settings (GET) Should succeed with 200', () => {
    return request(app.getHttpServer())
      .get('/admin/settings')
      .set({ 'user-id': '2' })
      .set({ 'x-forwarded-for': '100.100.100.1' })
      .expect(200)
      .expect('Hello World!');
  });

  it('/admin/settings (GET) Should succeed with 200', () => {
    return request(app.getHttpServer())
      .get('/admin/settings')
      .set({ 'user-id': '1' })
      .set({ 'x-forwarded-for': '100.100.100.1' })
      .expect(200)
      .expect('Hello World!');
  });

  it('/admin/settings (GET) Should fail with 401', () => {
    return request(app.getHttpServer())
      .get('/admin/settings')
      .set({ 'user-id': '2' })
      .set({ 'x-forwarded-for': '100.100.100.100' })
      .expect(401)
      .expect({ statusCode: 401, message: 'Not Authorized!' });
  });
});
