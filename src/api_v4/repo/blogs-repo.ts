import {randomUUID} from 'crypto';
import {blogsCollection, BlogViewModel} from '../../db/db';
import {InsertOneResult} from 'mongodb';


export type BlogInputModel = {
    "name": string
    "description": string
    "websiteUrl": string
}
export const blogsRepo = {
    async findBlogs(): Promise<BlogViewModel[]> {
        return await blogsCollection.find({}, {projection: {_id: false}}).toArray()
    },
    async findBlog(id: string): Promise<BlogViewModel | null> {
        const blog = blogsCollection.findOne({id}, {projection: {_id: false}})
        return blog
    },
    async createBlog(newBlog: BlogViewModel): Promise<InsertOneResult<BlogViewModel>> {
        return blogsCollection.insertOne(newBlog)


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
        await blogsCollection.deleteMany({})
    }
}