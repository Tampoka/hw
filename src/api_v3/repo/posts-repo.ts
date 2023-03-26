import {randomUUID} from 'crypto';
import {blogsCollection, postsCollection, PostViewModel} from '../../db/db';

export type PostInputModel = {
    "title": string
    "blogId": string
    "shortDescription": string
    "content": string
}

export const postsRepo = {
    async findPosts(): Promise<PostViewModel[]> {
        return await postsCollection.find({}).toArray()
    },
    async findPost(id: string): Promise<PostViewModel | null | boolean> {
        const post = postsCollection.findOne({id})
        if (post) {
            return post
        } else {
            return false
        }
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostViewModel | boolean> {
        const blog = await blogsCollection.findOne({id: blogId})
        if(blog) {
            const newPost: PostViewModel = {
                id: randomUUID(),
                title,
                shortDescription,
                content,
                blogId,
                blogName: blog!.name,
                createdAt: (new Date().toISOString()),
            }
            const result = postsCollection.insertOne(newPost)
            return newPost
        } else {
            return false
        }
    },
    async updatePost(id: string, valuesToUpdate: PostInputModel) {
        const result = await postsCollection.updateOne({id}, {
            $set: {
                title: valuesToUpdate.title,
                shortDescription: valuesToUpdate.shortDescription,
                content: valuesToUpdate.content
            }
        })
        if (result.matchedCount === 1) {
            return await postsCollection.findOne({id})
        } else {
            return false
        }
    },
    async deletePost(id: string): Promise<boolean> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount === 1
    },
    async deleteAll() {
        await postsCollection.deleteMany({})
    }
}