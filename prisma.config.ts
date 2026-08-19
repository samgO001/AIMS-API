import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config();

if (!process.env.DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not defined. Please set it in your .env file.'
  );
}

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
