import {Request, Response, Router} from 'express';
import {CodeResponsesEnum} from '../../enums';
import {authMiddleware} from '../middleware/isAuth';
import {
    blogIdValidation,
    contentValidation,
    postInputValidationMiddleware,
    shortDescriptionValidation,
    titleValidation
} from '../middleware/post-input-validation';
import {postsRepo} from '../repo/posts-repo';

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    const result = await postsRepo.findPosts()
        res.status(CodeResponsesEnum.OK_200).send(result)
})
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const result = await postsRepo.findPost(req.params.id)
    if (result) {
        res.status(CodeResponsesEnum.OK_200).send(result)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})

postsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    // if (!req.params.id) {
    //     res.status(CodeResponsesEnum.Not_found_404)
    // }
    let result = await postsRepo.deletePost(req.params.id);
    if (result) {
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
postsRouter.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, postInputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await postsRepo.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    res.status(CodeResponsesEnum.Created_201).send(result)
})
postsRouter.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, postInputValidationMiddleware, async (req: Request, res: Response) => {
    if (!req.params.id) {
        res.status(CodeResponsesEnum.Not_found_404)
    }
    const valuesToUpdate = req.body

    const result = await postsRepo.updatePost(req.params.id, valuesToUpdate)
    if (result) {
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
