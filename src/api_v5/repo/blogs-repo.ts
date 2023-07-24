import {blogsCollection, BlogViewModel} from '../../db/db';
import {InsertOneResult} from 'mongodb';
import {BlogInputModel} from '../domain/blogs-service';

export type Paginator<T> = {
    pagesCount?: number
    page?: number
    pageSize?: number
    totalCount?: number
    items: T[]
}

export const blogsRepo = {
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