import {randomUUID} from 'crypto';
import {blogsRepo} from '../repo/blogs-repo';
import {BlogViewModel} from '../../db/db';
import {InsertOneResult, ObjectId} from 'mongodb';


export type BlogInputModel = {
    "name": string
    "description": string
    "websiteUrl": string
}
export const blogsService = {
    async findBlogs(name?:string): Promise<BlogViewModel[]> {
        return blogsRepo.findBlogs(name)
    },
    async findBlog(id: string): Promise<BlogViewModel | null> {
        return blogsRepo.findBlog(id)
    },
    async findNewlyCreatedBlog(id: ObjectId): Promise<BlogViewModel | null> {
        return blogsRepo.findNewlyCreatedBlog(id)
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<InsertOneResult<BlogViewModel>> {
        const newBlog: BlogViewModel = {
            id: randomUUID(),
            name,
            description,
            websiteUrl,
            createdAt: (new Date().toISOString()),
            isMembership: false
        }
        return blogsRepo.createBlog(newBlog)
    },
    async updateBlog(id: string, valuesToUpdate: BlogInputModel): Promise<BlogViewModel | boolean | null> {
        return blogsRepo.updateBlog(id, valuesToUpdate)
    },
    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepo.deleteBlog(id)
    },
    async deleteAll(): Promise<void> {
        await blogsRepo.deleteAll()
    }
}