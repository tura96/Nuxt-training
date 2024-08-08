import { defineEventHandler, readBody } from 'h3';
import { promises as fs } from 'fs';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password, email, confirmPassword, agreeTerms } = body;

  if (!agreeTerms) {
    return { statusCode: 400, body: { message: 'You must agree to the terms and conditions.' } };
  }

  if (password !== confirmPassword) {
    return { statusCode: 401, body: { message: 'Passwords do not match.' } };
  }

  const userData = { username, password, email, registeredAt: new Date() };

  try {
    await fs.appendFile('users.txt', JSON.stringify(userData) + '\n');
    return { statusCode: 201, body: { message: 'User registered successfully' } };
  } catch (error) {
    return { statusCode: 500, body: { message: 'Internal server error', error } };
  }
});
