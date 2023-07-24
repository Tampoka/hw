import {Request, Response, Router} from 'express';
import {usersService} from '../domain/users-service';
import {CodeResponsesEnum} from '../../enums';
import {
    emailValidation,
    loginValidation,
    passwordValidation,
    userInputValidationMiddleware
} from '../middleware/user-input-validation';
import {middleware} from '../middleware';

export const authRouter = Router({})

authRouter.post('/login',loginValidation,emailValidation,passwordValidation,middleware.USER_INPUT_VALIDATION, async (req:Request, res:Response) =>  {
   const checkResult = await usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkResult) {
        res.status(CodeResponsesEnum.No_content_204)
    } else {
        res.status(401)
    }
})