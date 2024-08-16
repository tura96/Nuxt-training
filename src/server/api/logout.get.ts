import path from 'path';
import { promises as fs } from 'fs';
import { setCookie } from 'h3';

export default defineEventHandler(async (event) => {
    console.log('Logout request received');
    const { getAuth, user } = event.context;
    
    if (getAuth && user) {
        const filePath = path.join(process.cwd(), 'server', 'data.txt');
        let userData = [];
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');
            userData = JSON.parse(fileContent);
        } catch (err) {
            console.error('Error reading data file:', err);
            return {
                status: 500,
                message: 'Internal Server Error',
            };
        }

        const userIndex = userData.findIndex(u => u.ID === user.id);
        if (userIndex !== -1) {
            userData[userIndex] = {
                ...userData[userIndex],
                Time: '',
                Ip: '',
                Code: 0,
                User_agent: '',
                Token_check: '',
                Token_refresh: '',
            };

            try {
                await fs.writeFile(filePath, JSON.stringify(userData, null, 2), 'utf-8');
            } catch (err) {
                console.error('Error writing data file:', err);
                return {
                    status: 500,
                    message: 'Internal Server Error',
                };
            }

            setCookie(event, 'refreshToken', '', {
                httpOnly: true,
                secure: false,
                maxAge: 0,
                expires: new Date(0),
            });

            setCookie(event, 'accessToken', '', {
                httpOnly: true,
                secure: false,
                maxAge: 0,
                expires: new Date(0),
            });

            setCookie(event, 'cookie_login', '', {
                httpOnly: true,
                secure: false,
                maxAge: 0,
                expires: new Date(0),
            });

            setCookie(event, 'SID', '', {
                httpOnly: true,
                secure: false,
                maxAge: 0,
                expires: new Date(0),
            });

            setCookie(event, 'auth', '', {
                httpOnly: true,
                secure: false,
                maxAge: 0,
                expires: new Date(0),
            });

            return {
                status: 200,
                message: 'Logout successful',
            };
        } else {
            return handleErrorAPI(event, 'Account does not exist', 403);
        }
    } else {
        return handleErrorAPI(event, 'Unauthorized', 401);
    }
});
