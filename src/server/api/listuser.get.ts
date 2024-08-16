import { promises as fs } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const { getAuth, user } = event.context;

  if (getAuth && typeof user !== 'undefined') {
    try {
      const filePath = path.join(process.cwd(), 'server', 'data.txt');
      let userData = [];

      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        userData = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading or parsing data file:', err);
        return {
          status: 400, 
          message: 'Could not read or parse user data file.',
        };
      }

      const filteredUserData = userData.map(user => ({
        ID: user.ID,
        Username: user.Username,
        Email: user.Email,
        Role: user.Role,
        Create_at: user.Create_at,
      }));

      filteredUserData.reverse();

      return {
        status: 200,
        data: filteredUserData,
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        status: 403,
        message: 'An error occurred while retrieving the user data.',
      };
    }
  } else {
    return {
      status: 403,
      message: 'Unauthorized access.',
    };
  }
});
