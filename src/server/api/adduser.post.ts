import { promises as fs } from 'fs';
import path from 'path';
import { createHash } from 'crypto';

export default defineEventHandler(async (event) => {
  try {
    const { getAuth, user } = event.context;
    const body = await readBody(event);
    
    console.log('user',user);

    const { username = '', email = '', password = '', confirmpassword = '', role = '', remember = '' } = body;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    const validLocalPartRegex = /^[a-zA-Z0-9._%+-]+$/;
    const validDomainPartRegex = /^[a-zA-Z0-9.-]+$/;
    const localPart = email.split('@')[0];
    const domainPart = email.split('@')[1];

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>[\]\/\\~`';\-_=+])[A-Za-z\d!@#$%^&*(),.?":{}|<>[\]\/\\~`';\-_=+]{8,}$/;
    
    if (!username || !role || !emailRegex.test(email) || !validLocalPartRegex.test(localPart) || !validDomainPartRegex.test(domainPart) || !password || password !== confirmpassword || !remember  || !passRegex.test(password)) {
      return {
        status: 403,
        body: { message: 'No permission' },
      };
    }

    if(getAuth && typeof user != 'undefined' ) {
      console.log('1212');
      
      const roleExists = user.role;
      if(roleExists !== 'admin'){
        return {
          status: 403,
          message: 'No permission ',
        };
      }

      const filePath = path.join(process.cwd(), 'server', 'data.txt');
      let userData = [];
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        userData = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading file:', err);
        return {
          status: 400,
          message: 'Error reading file',
        }
      }
      

      const emailExists = userData.some(user => user.Email === email);
      if (emailExists) {
        return {
          status: 403,
          message: 'User already exists with this email !',
        };
      }
  
      const newId = userData.length > 0 ? userData[userData.length - 1].ID + 1 : 1;
      const md5 = createHash('md5');
      const encryptedPassword = md5.update(password).digest('hex');
      let currentTimeNumber = formatDate(new Date());
      const newUser = {
        ID: newId,
        Username: username,
        Email: email,
        Remember: true, 
        Role: role, 
        Password: encryptedPassword,
        Create_at: currentTimeNumber,
      };
  
      userData.push(newUser);
      
      try {
        await fs.writeFile(filePath, JSON.stringify(userData, null, 2), 'utf-8');
      } catch (err) {
          console.error('Error write file:', err);
          return {
            status: 400,
            message: 'Error write file',
          };
      }
      return {
        status: 200,
        message: 'User registered successfully.',
      };
    }

    function formatDate(dateString:any) {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = String(date.getFullYear()); 
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }
    
  } catch (error) {
    console.error('Error request data:', error);
    return {
      status: 400,
      message: 'An error occurred while registering the user.',
    };
  }
});
