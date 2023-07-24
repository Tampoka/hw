import express, {Request, Response} from 'express';
import {postsRouter} from './api_v5/routes/posts-router';
import {blogsRouter} from './api_v5/routes/blogs-router';
import {blogsService} from './api_v5/domain/blogs-service';
import {postsService} from './api_v5/domain/posts-service';
import {usersRouter} from './api_v5/routes/users-router';
import {authRouter} from './api_v5/routes/auth-router';


export const app = express()
app.use(express.json());

app.use('/api/v5/blogs', blogsRouter)
app.use('/api/v5/posts', postsRouter)
app.use('/api/v5/users', usersRouter)
app.use('/api/v5/auth', authRouter)

app.delete('/api/v5/testing/all-data', async (req: Request, res: Response) => {
    await blogsService.deleteAll()
    await postsService.deleteAll()
    res.sendStatus(204)
})

