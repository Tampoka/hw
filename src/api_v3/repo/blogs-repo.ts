import {randomUUID} from 'crypto';
import {blogsCollection, BlogViewModel} from '../../db/db';
import {ObjectId} from 'mongodb';


export type BlogInputModel = {
    "name": string
    "description": string
    "websiteUrl": string
}
export const blogsRepo = {
    async findBlogs(): Promise<BlogViewModel[]> {
        return await blogsCollection.find({}, {projection: {_id: false}}).toArray()
    },
    async findBlog(id: string): Promise<BlogViewModel | null | boolean> {
        const blog = blogsCollection.findOne({id}, {projection: {_id: false}})
        if (blog) {
            return blog
        } else {
            return false
        }
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogViewModel | null> {
        const newBlog: BlogViewModel = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
            createdAt: (new Date().toISOString()),
            isMembership: false
        }
        const result = await blogsCollection.insertOne(newBlog)
        return await blogsCollection.findOne({_id: result.insertedId}, {projection: {_id: false}})
    },
    async updateBlog(id: string, valuesToUpdate: BlogInputModel): Promise<BlogViewModel | boolean | null> {
        const result = await blogsCollection.updateOne({id}, {
            $set: {
                name: valuesToUpdate.name,
                description: valuesToUpdate.description,
                websiteUrl: valuesToUpdate.websiteUrl
            }
        })
        if (result.matchedCount === 1) {
            return await blogsCollection.findOne({id}, {projection: {_id: false}})
        } else {
            return false
        }
    },
    async deleteBlog(id: string): Promise<boolean> {
        const result = await blogsCollection.deleteOne({id})
        return result.deletedCount === 1;

    },
    async deleteAll(): Promise<void> {
        // blogsData = []
        await blogsCollection.deleteMany({})
    }
}