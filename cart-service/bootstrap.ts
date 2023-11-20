import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DB } from './db';

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;

export const bootstrap = async () => {
  await DB.connect({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  return NestFactory.create(AppModule);
};
