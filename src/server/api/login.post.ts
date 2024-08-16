import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';
import sentEmail from '../utils/sentMail';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const email = body.email ?? '';
    const clientIp = body.clientIp ?? '';
    const userAgent = body.userAgent ?? '';
    const pass_word = body.password ?? '';
    const currentTimeNumber = Date.now();
   
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    const validLocalPartRegex = /^[a-zA-Z0-9._%+-]+$/;
    const validDomainPartRegex = /^[a-zA-Z0-9.-]+$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>[\]\/\\~`';\-_=+])[A-Za-z\d!@#$%^&*(),.?":{}|<>[\]\/\\~`';\-_=+]{8,}$/;

    const localPart = email.split('@')[0];
    const domainPart = email.split('@')[1];
    if (!clientIp || !userAgent || !emailRegex.test(email) || !validLocalPartRegex.test(localPart) || !validDomainPartRegex.test(domainPart) || !pass_word || !passRegex.test(pass_word)) {
        return {
            status: false,
            body: { message: 'No permission' }
        };
    }
    const pass = crypto.createHash('md5').update(pass_word).digest("hex") ?? '';
   
    const code_random = Math.floor(100000 + Math.random() * 900000);

    const filePath = path.join(process.cwd(), 'server', 'data.txt');
    let userData = [];
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        userData = JSON.parse(fileContent);
    } catch (err) {
        console.error('Error reading data file:', err);
        return {
            status: 400,
            message: 'Could not read user data file.',
        };
    }

    const userIndex = userData.findIndex(user => user.Email === email && user.Password === pass && user.Role === 'admin');
    if (userIndex !== -1) {
        const conntent_email =  `<h3 style="font-size: 18px; margin: 0; font-weight: 100; margin-bottom: 5px;">Hello, ${userData[userIndex].Username}</h3>
        <h3 style="font-size: 18px; margin: 0; font-weight: 100; margin-bottom: 5px;">We received a request to sign in to Mediacorp Star Search. If you want to sign in with your ${email} account</h3>
        <h3 style="font-size: 18px; margin: 0; font-weight: 100; margin-bottom: 30px;">Your login code : <span style="color: black; font-weight: 700;" >${code_random}</span></h3>`;
        // await sentEmail(email, 'Your Security Login Code', conntent_email);
        console.log(`CODE========== ${email}=====`, code_random);

        userData[userIndex].Time = currentTimeNumber;
        userData[userIndex].Ip = clientIp;
        userData[userIndex].User_agent = userAgent;
        userData[userIndex].Code = code_random;

        try {
            await fs.writeFile(filePath, JSON.stringify(userData, null, 2), 'utf-8');
        } catch (err) {
            console.error('Error writing update data file:', err);
            return {
                status: 400,
                message: 'Could not update user data file.',
            };
        }

        return {
            status: true,
            message: 'We’ve sent a veritification code to your email, please check'
        };
    }else {
        return {
            status: false,
            message: 'Account or password is incorrect!',
        };
    }

});
