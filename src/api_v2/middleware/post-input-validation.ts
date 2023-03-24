import {Response, Request, NextFunction} from 'express';
import {body, ValidationError, validationResult} from 'express-validator';

const errorFormatter = ({msg}: ValidationError) => {
    return msg;
};
export const titleValidation = body('title').isString().trim().isLength({
    min: 1,
    max: 30
}).withMessage({message: 'Post title should be from 1 to 30 symbols', field: 'title'});

export const shortDescriptionValidation = body('shortDescription').isString().trim().isLength({
    min: 1,
    max: 100
}).withMessage({
    message: 'Post shortDescription should be from 1 to 100 symbols',
    field: 'post shortDescription'
});

export const contentValidation = body('content').isString().trim().isLength({
    min: 1,
    max: 1000
}).withMessage({
    message: 'Post content should be from 1 to 1000 symbols',
    field: 'post content'
});

export const blogIdValidation = body('content').isString().trim().isLength({
    min: 1,
}).withMessage({
    message: 'Post blogId should be from 1 symbol',
    field: 'post blogId'
});

export const postInputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).json({errorMessages: errors.array()})
    } else {
        next()
    }
}