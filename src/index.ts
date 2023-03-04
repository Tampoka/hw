import express from 'express'
import {videosRouter} from './routes/videos-router';

const app = express()
const port = process.env.PORT || 3015

app.use(express.json());

app.use('/videos', videosRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})