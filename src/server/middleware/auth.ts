import { defineEventHandler, H3Event, getCookie, setCookie } from 'h3';
import { convertStringToNumber } from '../utils/helper';
import { handleErrorAPI } from '../utils/handleErrorAPI';
import { getCookieCustom } from '../utils/helper';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';

const excludeURLs = ['/api/login', '/api/sentcode','/api/register' ];

export default defineEventHandler(async (event: H3Event) => {
    
    const runtimeConfig = useRuntimeConfig();
    const { req } = event.node;
    
    // console.log('44444444444444444444444444');
    if (!event.path.startsWith('/api/') || excludeURLs.includes(event.path)) {
        console.log('redirect true');
        return;
    }

    const getCacheIP = () => {
        const cacheIP = getCookie(event, 'SID');
        return cacheIP ? convertStringToNumber(cacheIP) : '';
    };

    const clearAllCookie = () => {
        ['accessToken', 'cookie_login', 'SID'].forEach(cookie => {
            setCookie(event, cookie, '', {
                httpOnly: true,
                secure: true,
                maxAge: 0,
                expires: new Date(0)
            });
        });
    };

    const checkIP = req.headers?.ip || getCacheIP();
    const checkUserAgent = req.headers['user-agent'];
    const cookies = req.headers?.cookie;
    const getCookieLogin = getCookieCustom(cookies, 'cookie_login') ?? '';
    
    const getAccessToken = getCookie(event, 'accessToken');
    const checkToken = crypto.createHash('md5').update(getCookieLogin).digest("hex");
    

    if (!cookies || !checkUserAgent || !checkIP || !getCookieLogin || !getAccessToken) {
        return handleErrorAPI(event);
    }

    try {
        const verified = jwt.verify(getAccessToken, runtimeConfig.public.key_jwt);
        if (!verified || !verified.user_login) {
            return handleErrorAPI(event, 'Invalid token!');
        }

        if (verified.user_login) {
            const userId = verified.user_login;
            const filePath = path.join(process.cwd(), 'server', 'data.txt');
            let userData = [];

            try {
                const fileContent = await fs.readFile(filePath, 'utf-8');
                userData = JSON.parse(fileContent);
            } catch (err) {
                console.error('Error reading data file:', err);
                return handleErrorAPI(event, 'Could not read user data file.', 400);
            }

            const userIndex = userData.findIndex(user => user.ID === userId && user.Token_check === checkToken && user.User_agent === checkUserAgent && user.Role === 'admin');
            if (userIndex !== -1) {
                const userInfo = {
                    id: userId,
                    email: userData[userIndex].Email,
                    role: userData[userIndex].Role,
                    ip: checkIP,
                    userAgent: checkUserAgent
                };
                const token_refresh_check = userData[userIndex].Token_refresh;
                event.context.user = userInfo;

                const currentTime = Math.floor(Date.now() / 1000);
                const timeLeft = verified.exp - currentTime;
                console.log('time end', timeLeft);
                
                // console.log('token_refresh_check',token_refresh_check);
                const newExpiryTime = new Date();
                newExpiryTime.setTime(newExpiryTime.getTime() + (30 * 60 * 1000));

                if (timeLeft < 5 * 60) {

                    const verified_refresh = jwt.verify(token_refresh_check, runtimeConfig.public.key_refresh_jwt);

                    if(verified_refresh.user_login){
                        const newAccessToken = jwt.sign(
                            { user_login: userId },
                            runtimeConfig.public.key_jwt,
                            { expiresIn: '30m' }
                        );
                        const newRefreshAccessToken = jwt.sign(
                            { user_login: userId },
                            runtimeConfig.public.key_refresh_jwt,
                            { expiresIn: '1d' }
                        );
                        userData[userIndex].Token_refresh = newRefreshAccessToken;

                        try {
                            await fs.writeFile(filePath, JSON.stringify(userData, null, 2), 'utf-8');
                        } catch (err) {
                            console.error('Error writing update Token_refresh data file:', err);
                            return {
                                status: 400,
                                message: 'Could not update user Token_refresh data file.',
                            };
                        }

                        setCookie(event, 'accessToken', newAccessToken, {
                            httpOnly: true,
                            secure: true,
                            expires: newExpiryTime
                        });
                    }

                    
    
                    
                }
            } else {
                clearAllCookie();
                return handleErrorAPI(event, 'Account does not exist', 403);
            }
        }
        event.context.getAuth = verified;
    } catch (err) {
        console.error('JWT verification error:', err);
        if (err instanceof jwt.JsonWebTokenError) {
            return handleErrorAPI(event, 'Invalid token.');
        } else if (err instanceof jwt.TokenExpiredError) {
            return handleErrorAPI(event, 'Token expired');
        } else {
            return handleErrorAPI(event, 'Internal Server Error', 500);
        }
    }
    // console.log('checkTokenrrrrrrrrrrrrrrr');
    // event.context.getToken = checkToken;
    // event.context.getIP = checkIP;
    // event.context.getUserAgent = checkUserAgent;
});