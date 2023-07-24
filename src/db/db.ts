import dotenv from 'dotenv'
import {MongoClient} from 'mongodb';
import {UserDBModel} from '../api_v5/repo/users-repo';

dotenv.config()

export type BlogViewModel = {
    "id": string
    "name": string
    "description": string
    "websiteUrl": string
    createdAt?: string
    isMembership?: boolean
}
export type PostViewModel = {
    id: string
    "blogId": string
    "blogName": string
    "title": string
    "shortDescription": string
    "content": string
    createdAt?: string
}
export type UserViewModel = {
    id: string
    "login": string
    "email": string
    createdAt?: string
}

export enum SortDirections {
    asc = 1,
    desc = -1
}

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017'
// console.log(process.env.MONGO_URL)

const client = new MongoClient(mongoURL)
const db = client.db('backend-dev')
export const blogsCollection = db.collection<BlogViewModel>('blogs')
export const postsCollection = db.collection<PostViewModel>('posts')
export const usersCollection = db.collection<UserDBModel>('users')


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