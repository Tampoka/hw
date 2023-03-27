import {randomUUID} from 'crypto';
import {blogsRepo} from '../api_v4/repo/blogs-repo';
import {BlogViewModel} from '../db/db';
import {InsertOneResult} from 'mongodb';


export type BlogInputModel = {
    "name": string
    "description": string
    "websiteUrl": string
}
export const blogsService = {
    async findBlogs(): Promise<BlogViewModel[]> {
        return blogsRepo.findBlogs()
    },
    async findBlog(id: string): Promise<BlogViewModel | null> {
        return blogsRepo.findBlog(id)
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