import {postsCollection, PostViewModel, SortDirections} from '../../db/db';
import {InsertOneResult, ObjectId} from 'mongodb';
import {Paginator} from './blogs-repo';

export type PostInputModel = {
    "title": string
    "blogId": string
    "shortDescription": string
    "content": string
}

export const postsRepo = {
    async findPosts(title?: string, sortBy: string = 'createdAt', sortDirection: keyof typeof SortDirections = 'desc', pageNumber: number = 1, pageSize: number = 10): Promise<Paginator<PostViewModel>> {
        const filter: any = {}
        if (title) {
            filter.title = {$regex: title, $options: 'i'}
        }
        const posts = await postsCollection.find(filter, {projection: {_id: false}}).sort({sortBy: SortDirections[sortDirection]}).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        const postsWithPaginator: Paginator<PostViewModel> = {
            pagesCount: Math.ceil(posts.length / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: posts.length,
            items: posts
        }
        return postsWithPaginator
    },
    async findPost(id: string): Promise<PostViewModel | null> {
        const post = postsCollection.findOne({id}, {projection: {_id: false}})
        return post
    },
    async findNewlyCreatedPost(id: ObjectId): Promise<PostViewModel | null> {
        const post = postsCollection.findOne({_id: id}, {projection: {_id: false}})
        return post
    },
    async createPost(newPost: PostViewModel): Promise<InsertOneResult<PostViewModel>> {
        return postsCollection.insertOne(newPost)
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
            return await postsCollection.findOne({id}, {projection: {_id: false}})
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