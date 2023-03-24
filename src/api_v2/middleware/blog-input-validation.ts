import {Response, Request, NextFunction} from 'express';
import {body, ValidationError, validationResult} from 'express-validator';

const urlRegex = '^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$'

const errorFormatter = ({msg}: ValidationError) => {
    return msg;
};
export const nameValidation = body('name',{
    message: 'Name is required',
    field: 'name'
}).isString().trim().isLength({
    min:1,
    max: 15
});

export const descriptionValidation = body('description').isString().trim().isLength({
    min:1,
    max: 500
}).withMessage({
    message: 'Description should be from 1 to 500 symbols',
    field: 'description'
});

export const websiteUrlValidation = body('websiteUrl').isString().trim().isLength({
    min: 1,
    max: 100
}).withMessage({
    message: 'Url should be from 1 to 100 symbols',
    field: 'websiteUrl'
}).matches(urlRegex).withMessage({
    message: 'Url should match regex',
    field: 'websiteUrl'
});

export const blogInputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errors.array()})
    } else {
        next()
    }
}