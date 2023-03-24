import {Response, Request, NextFunction} from 'express';
import {body, ValidationError, validationResult} from 'express-validator';

const errorFormatter = ({msg}: ValidationError) => {
    return msg;
};
export const titleValidation = body('title', {
    message: 'Title is required',
    field: 'title'
}).isString().trim().isLength({
    max: 30
}).withMessage({message: 'Post title should be up to 30 symbols', field: 'title'});

export const shortDescriptionValidation = body('shortDescription', {
    message: 'Title is required',
    field: 'shortDescription'
}).isString().trim().isLength({
    max: 100
}).withMessage({
    message: 'Post shortDescription should be from 1 to 100 symbols',
    field: 'shortDescription'
});

export const contentValidation = body('content').isString().trim().isLength({
    min: 1,
    max: 1000
}).withMessage({
    message: 'Post content should be from 1 to 1000 symbols',
    field: 'content'
});

export const blogIdValidation = body('content').isString().trim().isLength({
    min: 1,
}).withMessage({
    message: 'Post blogId should be from 1 symbol',
    field: 'blogId'
});

export const postInputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errors.array()})
    } else {
        next()
    }
}