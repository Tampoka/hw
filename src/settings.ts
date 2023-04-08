import express, {Request, Response} from 'express';
import {postsRouter} from './api_v4/routes/posts-router';
import {blogsRouter} from './api_v4/routes/blogs-router';
import {blogsService} from './api_v4/domain/blogs-service';
import {postsService} from './api_v4/domain/posts-service';


export const app = express()
app.use(express.json());

app.use('/api/v4/blogs', blogsRouter)
app.use('/api/v4/posts', postsRouter)

app.delete('/api/v4/testing/all-data', async (req: Request, res: Response) => {
    await blogsService.deleteAll()
    await postsService.deleteAll()
    res.sendStatus(204)
})

