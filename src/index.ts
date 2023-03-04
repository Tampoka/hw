import express, {Request, Response} from 'express'
import {videosRouter} from './routes/videos-router';

const app = express()
const port = process.env.PORT || 3015
app.use(express.urlencoded({extended: true}));

app.use('/videos', videosRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})