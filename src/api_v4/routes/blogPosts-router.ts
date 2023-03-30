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

export const blogPostsRouter = Router({})

blogPostsRouter.get('/', async (req: Request, res: Response) => {
    const result = await postsRepo.findPosts()
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
// blogPostsRouter.post('/', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, postInputValidationMiddleware, async (req: Request, res: Response) => {
//     const result = await postsRepo.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
//     res.status(CodeResponsesEnum.Created_201).send(result)
// })

