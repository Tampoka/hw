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
import {PostViewModel, SortDirections} from '../../db/db';
import {postsService} from '../domain/posts-service';
import {
    blogPostInputValidationMiddleware,
    contentValidation,
    shortDescriptionValidation,
    titleValidation
} from '../middleware/blog-post-Input-validation';
import {
    emailValidation,
    loginValidation,
    passwordValidation, userInputValidationMiddleware
} from '../middleware/user-input-validation';
import {usersService} from '../domain/users-service';

export const usersRouter = Router({})

usersRouter.get('/', async (req: Request, res: Response) => {
    const login = req.query.searchLoginTerm?.toString()
    const email = req.query.searchEmailTerm?.toString()
    const sortBy = req.query.sortBy??'createdAt'
    const sortDirection = req.query.sortDirection??'desc' as (keyof typeof SortDirections)
    const pageNumber = req.query.pageNumber??1
    const pageSize = req.query.pageSize??10
    const result = await usersService.findUsers(login,email, sortBy, sortDirection, Number(pageNumber), Number(pageSize))
    res.status(CodeResponsesEnum.OK_200).send(result)
})
usersRouter.get('/:id', async (req: Request, res: Response) => {
    const result = await blogsService.findBlog(req.params.id)
    if (result) {
        res.status(CodeResponsesEnum.OK_200).send(result)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})

usersRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    let result = await blogsService.deleteBlog(req.params.id);
    if (result) {
        // await postsRepo.deleteBlogAllPosts(req.params.id)
        res.sendStatus(CodeResponsesEnum.No_content_204)
    } else {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    }
})
usersRouter.post('/', loginValidation,passwordValidation,emailValidation,userInputValidationMiddleware, async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body.login, req.body.email, req.body.password)
    res.status(CodeResponsesEnum.Created_201).send(newUser)
})
usersRouter.put('/:id', authMiddleware, nameValidation, descriptionValidation, websiteUrlValidation, blogInputValidationMiddleware, async (req: Request, res: Response) => {
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
usersRouter.get('/:id/posts', async (req: Request, res: Response) => {
    const blogId = req.params.id

    const checkBlogId = await blogsService.findBlog(blogId)
    if (!checkBlogId) {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    } else {
        const sortBy = req.query.sortBy??'createdAt' as (keyof  PostViewModel)
        const sortDirection = req.query.sortDirection??'desc' as (keyof typeof SortDirections)
        const pageNumber = req.query.pageNumber??1
        const pageSize = req.query.pageSize??10
        // @ts-ignore
        const result = await postsService.findBlogPosts(blogId, sortBy, sortDirection, Number(pageNumber), Number(pageSize))
        res.status(CodeResponsesEnum.OK_200).send(result)
    }
})
usersRouter.post('/:id/posts', authMiddleware, titleValidation, shortDescriptionValidation, contentValidation, blogPostInputValidationMiddleware, async (req: Request, res: Response) => {
    const checkBlogId = await blogsService.findBlog(req.params.id)
    if (!checkBlogId) {
        res.sendStatus(CodeResponsesEnum.Not_found_404)
    } else{
        const result = await postsService.createBlogPost(req.body.title, req.body.shortDescription, req.body.content, req.params.id)
        const newPost = await postsService.findNewlyCreatedPostPost(result.insertedId)
        res.status(CodeResponsesEnum.Created_201).send(newPost)
    }
})
