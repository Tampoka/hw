import {blogInputValidationMiddleware} from './blog-input-validation';
import {blogPostInputValidationMiddleware} from './blog-post-Input-validation';
import {authMiddleware} from './isAuth';
import {postInputValidationMiddleware} from './post-input-validation';
import {userInputValidationMiddleware} from './user-input-validation';

export const middleware={
    BLOG_INPUT_VALIDATION:blogInputValidationMiddleware,
    BLOG_POST_INPUT_VALIDATION:blogPostInputValidationMiddleware,
    IS_AUTH:authMiddleware,
    POST_INPUT_VALIDATION:postInputValidationMiddleware,
    USER_INPUT_VALIDATION: userInputValidationMiddleware,
}