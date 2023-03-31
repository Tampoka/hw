import {randomUUID} from 'crypto';
import {PostViewModel, SortDirections} from '../../db/db';
import {postsRepo} from '../repo/posts-repo';
import {blogsService} from './blogs-service';
import {InsertOneResult, ObjectId} from 'mongodb';

export type PostInputModel = {
    "title": string
    "blogId": string
    "shortDescription": string
    "content": string
}

export const postsService = {
    async findPosts(title?:string,sortBy?:string,sortDirection?:keyof typeof SortDirections,pageNumber?:number,pageSize?:number): Promise<PostViewModel[]> {
        return postsRepo.findPosts(title,sortBy,sortDirection,pageNumber,pageSize)
    },
    async findPost(id: string): Promise<PostViewModel | null> {
        return postsRepo.findPost(id)
    },
    async findNewlyCreatedPostPost(id: ObjectId): Promise<PostViewModel | null> {
        return postsRepo.findNewlyCreatedPost(id)
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<InsertOneResult<PostViewModel>> {
        const blog = await blogsService.findBlog(blogId)
        const newPost: PostViewModel = {
            id: randomUUID(),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog!.name,
            createdAt: (new Date().toISOString()),
        }
        return postsRepo.createPost(newPost)
    },
    async updatePost(id: string, valuesToUpdate: PostInputModel): Promise<PostViewModel | boolean | null> {
        return postsRepo.updatePost(id, valuesToUpdate)
    },
    async deletePost(id: string): Promise<boolean> {
        return postsRepo.deletePost(id)
    },
    async deleteAll() {
        await postsRepo.deleteAll()
    }
}