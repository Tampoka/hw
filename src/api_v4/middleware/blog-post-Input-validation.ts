import {Response, Request, NextFunction} from 'express';
import {body, ValidationError, validationResult} from 'express-validator';
import {blogsRepo} from '../repo/blogs-repo';

const errorFormatter = ({msg}: ValidationError) => {
    return msg;
};
export const titleValidation = body('title', {
    message: 'Title is required',
    field: 'title'
}).isString().trim().isLength({
    min: 1,
    max: 30
})

export const shortDescriptionValidation = body('shortDescription', {
    message: 'Short Description is required',
    field: 'shortDescription'
}).isString().trim().isLength({
    min: 1,
    max: 100
})

export const contentValidation = body('content').isString().trim().isLength({
    min: 1,
    max: 1000
}).withMessage({
    message: 'Post content should be from 1 to 1000 symbols',
    field: 'content'
});


export const blogPostInputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        res.status(400).json({errorsMessages: errors.array({onlyFirstError: true})})
    } else {
        next()
    }
}