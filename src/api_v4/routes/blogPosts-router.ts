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
import {SortDirections} from '../../db/db';
import {postsService} from '../domain/posts-service';

export const blogPostsRouter = Router({})

blogPostsRouter.get('/', async (req: Request, res: Response) => {
    const blogId = req.params.id
    const sortBy = req.query.sortBy?.toString()
    const sortDirection = req.query.sortDirection?.toString() as (keyof typeof SortDirections)
    const pageNumber = req.query.pageNumber?.toString
    const pageSize = req.query.pageSize?.toString()
    const result = await postsService.findBlogPosts(blogId, sortBy, sortDirection, Number(pageNumber), Number(pageSize))
    res.status(CodeResponsesEnum.OK_200).send(result)
})
blogPostsRouter.get('/', async (req: Request, res: Response) => {
    const result = await postsRepo.findPost(req.params.id)
    if (result) {
        res.status(CodeResponsesEnum.OK_200).send(result)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
//
// postsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
//     // if (!req.params.id) {
//     //     res.status(CodeResponsesEnum.Not_found_404)
//     // }
//     let result = await postsRepo.deletePost(req.params.id);
//     if (result) {
//         res.sendStatus(CodeResponsesEnum.No_content_204)
//     } else {
//         res.sendStatus(CodeResponsesEnum.Not_found_404)
//     }
// })
blogPostsRouter.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, postInputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await postsService.createBlogPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
    const newPost = await postsService.findNewlyCreatedPostPost(result.insertedId)
    res.status(CodeResponsesEnum.Created_201).send(newPost)
})

