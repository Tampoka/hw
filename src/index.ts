import express from 'express'
import {Request, Response} from 'express';
import {videosRouter} from './routes/videos-router';
import {videosRepo} from './repo/videos.-repo';

const app = express()
const port = process.env.PORT || 3015

app.use(express.json());

app.use('/videos', videosRouter)
app.get('/', (req: Request, res: Response) => {
    res.send('Hello back-end HomeWorks in it-incubator!!!')
})

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await videosRepo.deleteAll()
    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})