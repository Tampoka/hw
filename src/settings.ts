import express, {Request, Response} from 'express';
import {videosRouter} from './api_1v/routes/videos-router';
import {videosRepo} from './api_1v/repo/videos.-repo';

export const app = express()
app.use(express.json());

app.use('/api/v1/videos', videosRouter)
// app.use('/api/v2/blogs', blogsRouter)
// app.use('/api/v2/posts', postRouter)
// app.get('/', (req: Request, res: Response) => {
//     res.send('Hello back-end HomeWorks in it-incubator!!!')
// })

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await videosRepo.deleteAll()
    // await blogsRepo.deleteAll()
    // await postsRepo.deleteAll()
    res.sendStatus(204)
})