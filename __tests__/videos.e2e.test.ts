import request from 'supertest'
import {app} from '../src/settings'
import {VideoType} from '../src/repo/videos.-repo';
import {CodeResponsesEnum} from '../src/enums';

describe('/videos', () => {
    let newVideo: VideoType | null = null

    beforeAll(async () => {
        await request(app).delete('/testing/all-data').expect(CodeResponsesEnum.No_content_204)
    })

    it('GET products = []', async () => {
        await request(app).get('/videos/').expect(CodeResponsesEnum.OK_200, [])
    })

    it('- POST does not create the video with incorrect data (no title, no author)', async () => {
        await request(app)
            .post('/videos/')
            .send({title: '', author: ''})
            .expect(CodeResponsesEnum.Incorrect_values_400, {
                errorsMessages: [
                    {message: 'Title is required', field: 'title'},
                    {message: 'Author is required', field: 'author'},
                ],
            })

        const res = await request(app).get('/videos/')
        expect(res.body).toEqual([])
    })
    let createdVideo: any = null
    it('- POST create the video with correct data (title, author)', async () => {
        const title = 'Amazing'
        const author = 'Kuku'
        const date = new Date()

        const createResponse = await request(app)
            .post('/videos/')
            .send({
                title, author,
            })
            .expect(CodeResponsesEnum.Created_201
            )
        createdVideo = createResponse.body
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title,
            author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            // createdAt: new Date().toISOString(),
            createdAt: expect.any(String),
            // publicationDate: new Date(date.setDate(date.getDate() + 1)).toISOString(),
            publicationDate: expect.any(String),
            availableResolutions: ["P144"]
        })
        await request(app).get('/videos')
            .expect(CodeResponsesEnum.OK_200, [createdVideo])
    })

    it('- GET product by ID with incorrect id', async () => {
        await request(app).get('/videos/999').expect(CodeResponsesEnum.Not_found_404)
    })
    it('+ GET product by ID with correct id', async () => {
        await request(app)
            .get('/videos/' + createdVideo.id)
            .expect(CodeResponsesEnum.OK_200, createdVideo)
    })

    it('- PUT product by ID with incorrect data', async () => {
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({title: '', author: 'title'})
            .expect(CodeResponsesEnum.Incorrect_values_400)

        await request(app).get('/videos/' + createdVideo.id)
            .expect(CodeResponsesEnum.OK_200, createdVideo)
    })
    it('- PUT product by incorrect ID', async () => {
        await request(app)
            .put('/videos/' + 999)
            .send({title: 'title', author: 'title'})
            .expect(CodeResponsesEnum.Not_found_404)
    })
    it('+ PUT product by ID with correct data', async () => {
        await request(app)
            .put('/videos/' + createdVideo.id)
            .send({
                title: 'hello title',
                author: 'hello author',
                publicationDate: '2023-01-12T08:12:39.261Z',
            })
            .expect(CodeResponsesEnum.No_content_204)

        const res = await request(app).get('/videos/')
        expect(res.body[0]).toEqual({
            ...createdVideo,
            title: 'hello title',
            author: 'hello author',
            publicationDate: '2023-01-12T08:12:39.261Z'
        })
        createdVideo = res.body[0]
    })

    it('- DELETE product by incorrect ID', async () => {
        await request(app)
            .delete('/videos/876328')
            .expect(CodeResponsesEnum.Not_found_404)

        const res = await request(app).get('/videos/')
        expect(res.body[0]).toEqual(createdVideo)
    })
    it('+ DELETE product by correct ID', async () => {
        await request(app)
            .delete('/videos/' + createdVideo.id)
            .expect(CodeResponsesEnum.No_content_204)

        const res = await request(app).get('/videos/')
        expect(res.body.length).toBe(0)
    })
})
