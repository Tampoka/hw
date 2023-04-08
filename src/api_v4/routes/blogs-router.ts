import {Request, Response, Router} from 'express';
import {CodeResponsesEnum} from '../../enums';
import {
    blogInputValidationMiddleware,
    descriptionValidation,
    nameValidation,
    websiteUrlValidation
} from '../middleware/blog-input-validation';
import {authMiddleware} from '../middleware/isAuth';
import {blogsService} from '../domain/blogs-service';
import {SortDirections} from '../../db/db';
import {postsService} from '../domain/posts-service';
import {
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from '../middleware/blog-post-Input-validation';
import {blogPostInputValidationMiddleware} from '../middleware/blog-post-Input-validation';

export const blogsRouter = Router({})

blogsRouter.get('/', async (req: Request, res: Response) => {
    const name = req.query.searchNameTerm?.toString()
    const sortBy = req.query.sortBy?.toString()
    const sortDirection = req.query.sortDirection?.toString() as (keyof typeof SortDirections)
    const pageNumber = req.query.pageNumber?.toString
    const pageSize = req.query.pageSize?.toString()
    const result = await blogsService.findBlogs(name, sortBy, sortDirection, Number(pageNumber), Number(pageSize))
    res.status(CodeResponsesEnum.OK_200).send(result)
})
blogsRouter.get('/:id', async (req: Request, res: Response) => {
    const result = await blogsService.findBlog(req.params.id)
    if (result) {
        res.status(CodeResponsesEnum.OK_200).send(result)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})

blogsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    let result = await blogsService.deleteBlog(req.params.id);
    if (result) {
        // await postsRepo.deleteBlogAllPosts(req.params.id)
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
blogsRouter.post('/', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, blogInputValidationMiddleware, async (req: Request, res: Response) => {
    const result = await blogsService.createBlog(req.body.name, req.body.description, req.body.websiteUrl)
    const newBlog = await blogsService.findNewlyCreatedBlog(result.insertedId)
    res.status(CodeResponsesEnum.Created_201).send(newBlog)
})
blogsRouter.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, blogInputValidationMiddleware, async (req: Request, res: Response) => {
    // if (!req.params.id) {
    //     res.status(CodeResponsesEnum.Not_found_404)
    // }
    const valuesToUpdate = req.body

    const result = await blogsService.updateBlog(req.params.id, valuesToUpdate)
    if (result) {
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const blogId = req.params.id

    const checkBlogId = await blogsService.findBlog(blogId)
    if (!checkBlogId) {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    } else {
        const sortBy = req.query.sortBy?.toString()
        const sortDirection = req.query.sortDirection?.toString() as (keyof typeof SortDirections)
        const pageNumber = req.query.pageNumber?.toString
        const pageSize = req.query.pageSize?.toString()
        const result = await postsService.findBlogPosts(blogId, sortBy, sortDirection, Number(pageNumber), Number(pageSize))
        res.status(CodeResponsesEnum.OK_200).send(result)
    }
})
blogsRouter.post('/:id/posts', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogPostInputValidationMiddleware, async (req: Request, res: Response) => {
    const checkBlogId = await blogsService.findBlog(req.params.id)
    if (!checkBlogId) {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    } else{
        const result = await postsService.createBlogPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
        const newPost = await postsService.findNewlyCreatedPostPost(result.insertedId)
        res.status(CodeResponsesEnum.Created_201).send(newPost)
    }
})
