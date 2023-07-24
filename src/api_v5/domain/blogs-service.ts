import {randomUUID} from 'crypto';
import {blogsRepo, Paginator} from '../repo/blogs-repo';
import {BlogViewModel} from '../../db/db';
import {InsertOneResult, ObjectId} from 'mongodb';
import {blogsQueryRepo} from '../repo/blogs-query-repo';


export type BlogInputModel = {
    "name": string
    "description": string
    "websiteUrl": string
}

export const blogsService = {
    // @ts-ignore
    async findBlogs(name?: string, sortBy: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[], sortDirection: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[], pageNumber: number, pageSize: number): Promise<Paginator<BlogViewModel>> {
        return blogsQueryRepo.findBlogs(name, sortBy, sortDirection, pageNumber, pageSize)
    },
    async findBlog(id: string): Promise<BlogViewModel | null> {
        return blogsQueryRepo.findBlog(id)
    },
    async findNewlyCreatedBlog(id: ObjectId): Promise<BlogViewModel | null> {
        return blogsQueryRepo.findNewlyCreatedBlog(id)
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