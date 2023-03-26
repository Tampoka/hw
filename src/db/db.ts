import dotenv from 'dotenv'
import {MongoClient} from 'mongodb';

dotenv.config()

export type BlogViewModel = {
    "id": string
    "name": string
    "description": string
    "websiteUrl": string
    createdAt:string
    isMembership:boolean
}
export type PostViewModel = {
    id: string
    "blogId": string
    "blogName": string
    "title": string
    "shortDescription": string
    "content": string
    createdAt:string
}
const mongoURI = process.env.MONGO_URL || 'mongodb://localhost:27017'
console.log(process.env.MONGO_URL)

const client = new MongoClient(mongoURI)
const db=client.db('backend-dev')
export const blogsCollection=db.collection<BlogViewModel>('blogs')
export const postsCollection=db.collection<PostViewModel>('posts')


export const runDb = async () => {
    try {
        await client.connect()
        // await client.db('backend-dev').command({ping: 1})
        console.log('Connected to db!')
    } catch (e) {
        console.log('Can\'t connect to db!')
        await client.close()
    }
}