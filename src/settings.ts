import express, {Request, Response} from 'express';
import {postsRouter} from './api_v4/routes/posts-router';
import {blogsRouter} from './api_v4/routes/blogs-router';
import {blogsRepo} from './api_v4/repo/blogs-repo';
import {postsRepo} from './api_v4/repo/posts-repo';


export const app = express()
app.use(express.json());

app.use('/api/v4/blogs', blogsRouter)
app.use('/api/v4/posts', postsRouter)
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello back-end HomeWorks in it-incubator!!!')
// })

app.delete('/api/v4/testing/all-data', async (req: Request, res: Response) => {
    await blogsRepo.deleteAll()
    await postsRepo.deleteAll()
    res.sendStatus(204)
})

