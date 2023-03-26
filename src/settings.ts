import express, {Request, Response} from 'express';
// import {videosRouter} from './api_1v/routes/videos-router';
import {blogsRepo} from './api_v3/repo/blogs-repo';
import {blogsRouter} from './api_v3/routes/blogs-router';
import {postsRouter} from './api_v3/routes/posts-router';
import {postsRepo} from './api_v3/repo/posts-repo';

export const app = express()
app.use(express.json());

// app.use('/api/v1/videos', videosRouter)
app.use('/api/v3/blogs', blogsRouter)
app.use('/api/v3/posts', postsRouter)
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello back-end HomeWorks in it-incubator!!!')
// })

app.delete('/api/v3/testing/all-data', async (req: Request, res: Response) => {
    await blogsRepo.deleteAll()
    await postsRepo.deleteAll()
    res.sendStatus(204)
})

