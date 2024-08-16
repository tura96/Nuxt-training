import crypto from 'crypto';
import path from 'path';
import { promises as fs } from 'fs';
import { setCookie, getHeader } from 'h3'
import jwt from 'jsonwebtoken';
import { convertNumberToString } from '../utils/helper';

const runtimeConfig = useRuntimeConfig();
const jwtSecretKey = runtimeConfig.public.key_jwt;
const jwtRefreshSecretKey = runtimeConfig.public.key_refresh_jwt;

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const email = body.email ?? '';
    const clientIp = body.clientIp ?? '';
    const userAgent = body.userAgent ?? '';
    const pass_word = body.password ?? '';
    const verifyCode = body.code;
    const currentTimeNumber = Date.now();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
    const validLocalPartRegex = /^[a-zA-Z0-9._%+-]+$/;
    const validDomainPartRegex = /^[a-zA-Z0-9.-]+$/;
    const localPart = email.split('@')[0];
    const domainPart = email.split('@')[1];

    if (!clientIp || !verifyCode || !userAgent || !emailRegex.test(email) || !validLocalPartRegex.test(localPart) || !validDomainPartRegex.test(domainPart) || !pass_word) {
        return {
            status: false,
            body: { message: 'No permission' }
        };
    }
    
    const pass = crypto.createHash('md5').update(pass_word).digest("hex") ?? '';
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
    const userIndex = userData.findIndex(user => user.Email === email && user.Password === pass && user.User_agent === userAgent && user.Ip === clientIp && user.Role === 'admin');
    if (userIndex !== -1) {
        
        const setTime = userData[userIndex].Time;
        const checkCode = userData[userIndex].Code;
        const userName = userData[userIndex].Username;
        const userRole = userData[userIndex].Role;
        const futureTimeNumber = parseInt(setTime) + 5 * 60 * 1000;
        // console.log('checkCode',checkCode);
        // console.log('verifyCode',verifyCode);

        if(verifyCode == checkCode){
            
            if(futureTimeNumber > currentTimeNumber){
                console.log('true');
                
                const tag_cookie = currentTimeNumber + userData[userIndex].Email;
                const cookie = crypto.createHash('md5').update(tag_cookie).digest("hex");
                const check_token = crypto.createHash('md5').update(cookie).digest("hex");
                
                const userId = userData[userIndex].ID;
                
                let data = {
                    user_login: userId
                }
                const expiryTime = new Date();
                const expiryRefTime = new Date();

                expiryTime.setTime(expiryTime.getTime() + (30 * 60 * 1000));
                expiryRefTime.setTime(expiryRefTime.getTime() + (24 * 60 * 60 * 1000)); 

                const expiresIn = 30 * 60; 
                const expiresInRefresh = 24 * 60 * 60;

                const access_token = jwt.sign(data, jwtSecretKey, { expiresIn });
                const access_ref_token = jwt.sign(data, jwtRefreshSecretKey, { expiresIn: expiresInRefresh });

                setCookie(event, 'accessToken', access_token, {
                    httpOnly: true,
                    secure: true,
                    expires: expiryTime
                });

                setCookie(event, 'cookie_login', cookie, {
                    httpOnly: true,
                    secure: true,
                    expires: expiryTime
                });
                const setIp = convertNumberToString(clientIp);

                setCookie(event, 'SID', convertNumberToString(clientIp), {
                    httpOnly: true,
                    secure: true,
                    expires: expiryTime
                });

                userData[userIndex].Token_check = check_token;
                userData[userIndex].Token_refresh = access_ref_token;
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
                    body: {
                        message: 'Login Success',
                        userId : userId,
                        userName : userName,
                        userRole : userRole,
                    }
                };
            }else {
                return {
                    status: false,
                    message: 'The code is expired',
                };
            }
        }else{
            return {
                status: false,
                message: 'The code is invalid',
            };
        }

    }
});