import {Request, Response, Router} from 'express';
import {CodeResponsesEnum} from '../../enums';
import {authMiddleware} from '../middleware/isAuth';
import {postsRepo} from '../repo/posts-repo';
import {
    blogIdValidation,
    contentValidation,
    postInputValidationMiddleware,
    shortDescriptionValidation,
    titleValidation
} from '../middleware/post-input-validation';

export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    const result = postsRepo.findPosts()
    res.status(CodeResponsesEnum.OK_200).send(result)
})
postsRouter.get('/:id', (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(CodeResponsesEnum.Not_found_404)
    }
    const result = postsRepo.findPost(req.params.id)
    if (result) {
        res.status(CodeResponsesEnum.OK_200).send(result)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})

postsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(CodeResponsesEnum.Not_found_404)
    }
    let result = postsRepo.deletePost(req.params.id);
    if (result) {
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
postsRouter.post('/', authMiddleware, shortDescriptionValidation, titleValidation, contentValidation, blogIdValidation, postInputValidationMiddleware, (req: Request, res: Response) => {

    const result = postsRepo.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    res.status(CodeResponsesEnum.Created_201).send(result)
})
postsRouter.put('/:id', authMiddleware, shortDescriptionValidation, titleValidation, contentValidation, blogIdValidation, postInputValidationMiddleware, (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(CodeResponsesEnum.Not_found_404)
    }
    const valuesToUpdate = req.body

    const result = postsRepo.updatePost(req.params.id, valuesToUpdate)
    if (result) {
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
