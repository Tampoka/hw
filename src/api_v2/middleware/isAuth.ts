import {NextFunction, Request, Response} from 'express';
import {validationResult} from 'express-validator';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const auth = {login: 'admin', password: 'qwerty'} // change this

    // parse login and password from headers
    const basicAuth = (req.headers.authorization || '').split(' ')[0]
    if (basicAuth !== 'Basic') {
        return res.status(401).send('Authentication required.')
    }
    const b64auth = (req.headers.authorization || '').split(' ')[1] || ''

    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':')

    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password) {
        // Access granted...
        return next()
    } else {

        // Access denied...
        // res.set('WWW-Authenticate', 'Basic realm="401"') // change this
        res.status(401).send('Authentication required.') // custom message
    }
}