import { defineEventHandler, H3Event, getCookie, setCookie } from 'h3';
import { convertStringToNumber } from '../utils/helper';
import { handleErrorAPI } from '../utils/handleErrorAPI';
import { getCookieCustom } from '../utils/helper';
import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { useAuthStore } from '@/stores/auth'

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
        ['accessToken', 'cookie_login', 'SID', 'refreshToken'].forEach(cookie => {
            setCookie(event, cookie, '', {
                httpOnly: true,
                secure: true,
                maxAge: 0,
                expires: new Date(0)
            });
        });
    };
    const clearCookieAuth = () =>{
        const authData = JSON.stringify({ username: "", isLoggedIn: false });
        setCookie(event, 'auth', authData, {
            httpOnly: true,
            secure: true,
            path: '/', 
            maxAge: 0,
            expires: new Date(0)
        });
    }

    const checkIP = req.headers?.ip || getCacheIP();
    const checkUserAgent = req.headers['user-agent'];
    const cookies = req.headers?.cookie;
    const getCookieLogin = getCookieCustom(cookies, 'cookie_login') ?? '';
    
    const getAccessToken = getCookie(event, 'accessToken');
    const getAccessRefreshToken = getCookie(event, 'refreshToken');
    const checkToken = crypto.createHash('md5').update(getCookieLogin).digest("hex");
    

    if (!cookies || !checkUserAgent || !checkIP || !getCookieLogin || !getAccessToken || !getAccessRefreshToken) {
        clearCookieAuth();
        return handleErrorAPI(event);
    }

    try {
        const verified = jwt.verify(getAccessToken, runtimeConfig.public.key_jwt);
        if (!verified || !verified.user_login) {
            clearCookieAuth();
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
                // console.log('getAccessRefreshToken',getAccessRefreshToken);
                const newExpiryTime = new Date();
                newExpiryTime.setTime(newExpiryTime.getTime() + (30 * 60 * 1000));

                if (timeLeft < 5 * 60 && token_refresh_check === getAccessRefreshToken) {
                    const newAccessToken = jwt.sign(
                        { user_login: userId },
                        runtimeConfig.public.key_jwt,
                        { expiresIn: '30m' }
                    );
    
                    setCookie(event, 'accessToken', newAccessToken, {
                        httpOnly: true,
                        secure: true,
                        expires: newExpiryTime
                    });
                }
            } else {
                clearCookieAuth();
                clearAllCookie();
                return handleErrorAPI(event, 'Account does not exist', 403);
            }
        }
        event.context.getAuth = verified;
    } catch (err) {
        clearCookieAuth();
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