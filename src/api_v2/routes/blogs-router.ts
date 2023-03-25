import {Request, Response, Router} from 'express';
import {CodeResponsesEnum} from '../../enums';
import {blogsRepo} from '../repo/blogs-repo';
import {
    blogInputValidationMiddleware,
    descriptionValidation,
    nameValidation,
    websiteUrlValidation
} from '../middleware/blog-input-validation';
import {authMiddleware} from '../middleware/isAuth';
import {postsRepo} from '../repo/posts-repo';

export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    const result = blogsRepo.findBlogs()
    res.status(CodeResponsesEnum.OK_200).send(result)
    // if (result.length>0) {
    //     res.status(CodeResponsesEnum.OK_200).send(result)
    // } else {
    //     res.sendStatus(CodeResponsesEnum.Not_found_404)
    // }
})
blogsRouter.get('/:id', (req: Request, res: Response) => {
    // if (!req.params.id) {
    //     res.status(CodeResponsesEnum.Not_found_404)
    // }
    const result = blogsRepo.findBlog(req.params.id)
    if (result) {
        res.status(CodeResponsesEnum.OK_200).send(result)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})

blogsRouter.delete('/:id', authMiddleware, (req: Request, res: Response) =>  {
    // if (!req.params.id) {
    //     res.status(CodeResponsesEnum.Not_found_404)
    // }
    let result = blogsRepo.deleteBlog(req.params.id);
    if (result) {
        // postsRepo.deleteBlogAllPosts(req.params.id)
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
blogsRouter.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, blogInputValidationMiddleware, (req: Request, res: Response) => {

    const result = blogsRepo.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    res.status(CodeResponsesEnum.Created_201).send(result)
})
blogsRouter.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, blogInputValidationMiddleware, (req: Request, res: Response) => {
    // if (!req.params.id) {
    //     res.status(CodeResponsesEnum.Not_found_404)
    // }
    const valuesToUpdate = req.body

    const result = blogsRepo.updateBlog(req.params.id, valuesToUpdate)
    if (result) {
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
