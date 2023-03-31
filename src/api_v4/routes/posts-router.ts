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
import {postsService} from '../domain/posts-service';
import {SortDirections} from '../../db/db';

export const postsRouter = Router({})

postsRouter.get('/', async (req: Request, res: Response) => {
    const title = req.query.searchNameTerm?.toString()
    const sortBy = req.query.sortBy?.toString()
    const sortDirection = req.query.sortDirection?.toString() as (keyof typeof SortDirections)
    const pageNumber = req.query.pageNumber?.toString
    const pageSize = req.query.pageSize?.toString()
    const result = await postsService.findPosts(title, sortBy, sortDirection, Number(pageNumber), Number(pageSize))
    res.status(CodeResponsesEnum.OK_200).send(result)
})
postsRouter.get('/:id', async (req: Request, res: Response) => {
    const result = await postsService.findPost(req.params.id)
    if (result) {
        res.status(CodeResponsesEnum.OK_200).send(result)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})

postsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    let result = await postsService.deletePost(req.params.id);
    if (result) {
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
postsRouter.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, postInputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
    const newPost = await postsService.findPost(result.insertedId.toString())
    res.status(CodeResponsesEnum.Created_201).send(newPost)
})
postsRouter.put('/:id', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, postInputValidationMiddleware, async (req: Request, res: Response) => {
    // if (!req.params.id) {
    //     res.status(CodeResponsesEnum.Not_found_404)
    // }
    const valuesToUpdate = req.body

    const result = await postsService.updatePost(req.params.id, valuesToUpdate)
    if (result) {
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
