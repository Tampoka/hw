import {Response, Request, NextFunction} from 'express';
import {body, ValidationError, validationResult} from 'express-validator';

const loginRegex = '^[a-zA-Z0-9_-]*$'
const emailRegex = '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'

const errorFormatter = ({msg}: ValidationError) => {
    return msg;
};
export const loginValidation = body('login', {
    message: 'Login is required',
    field: 'login'
}).isString().trim()
    .isLength({
        min: 3,
        max: 10
    }).withMessage({message: 'Login should be from 3 to 10 symbols'})
    .matches(loginRegex)
    .withMessage({
        message: 'Login should match regex',
        field: 'login'
    }).optional({nullable: true})

export const emailValidation = body('email').isString().trim()
    .matches(emailRegex)
    .withMessage({
        message: 'Email should match regex',
        field: 'email'
    }).optional({nullable: true})
export const passwordValidation = body('password').isString().trim()
    .isLength({
        min: 6,
        max: 20
    })
    .withMessage({
        message: 'Password should be from 6 to 20 symbols',
        field: 'password'
    });

export const userInputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errors.array({onlyFirstError: true})})
    } else {
        next()
    }
}