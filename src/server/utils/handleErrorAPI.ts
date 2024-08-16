import { H3Event, setResponseStatus, setHeader, send , setCookie} from 'h3'

export const handleErrorAPI = (event: H3Event, statusMessage = 'Invalid request', statusCode = 400) => {
  setResponseStatus(event, statusCode)
  setHeader(event, 'Content-Type', 'application/json')
  const authData = JSON.stringify({ username: "", isLoggedIn: false });
  setCookie(event, 'auth', authData, {
      httpOnly: true,
      secure: true,
      path: '/', 
      maxAge: 0,
      expires: new Date(0)
  });
  return send(event, JSON.stringify({ 
      data: null, 
      error: {
          status: statusCode,
          name: 'ApplicationError',
          message: statusMessage
      } 
  }))
}