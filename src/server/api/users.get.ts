import { defineEventHandler } from 'h3';
import { promises as fs } from 'fs';

export default defineEventHandler(async () => {
  try {
    const data = await fs.readFile('users.txt', 'utf-8');
    const users = data.trim().split('\n').map(line => JSON.parse(line));
    return { statusCode: 200, body: users };
  } catch (error) {
    return { statusCode: 500, body: { message: 'Internal server error', error } };
  }
});
