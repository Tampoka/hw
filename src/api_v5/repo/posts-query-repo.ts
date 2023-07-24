import {postsCollection, PostViewModel, SortDirections} from '../../db/db';
import {ObjectId} from 'mongodb';
import {Paginator} from './blogs-repo';

export type PostInputModel = {
    "title": string
    "blogId": string
    "shortDescription": string
    "content": string
}


export const postsQueryRepo = {
    // @ts-ignore
    async findPosts(title?: string | undefined, sortBy: string, sortDirection: keyof typeof SortDirections, pageNumber: number, pageSize: number): Promise<Paginator<PostViewModel>> {
        const filter: any = {}
        if (title) {
            filter.title = {$regex: title, $options: 'i'}
        }
        let sortDir=-1
        sortDirection === 'asc' ? sortDir = 1 : sortDir = -1
        const sortConfig = {[sortBy]: sortDir}
        // @ts-ignore
        const posts = await postsCollection.find(filter, {projection: {_id: false}}).sort(sortConfig).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        const totalCount =title? await postsCollection.countDocuments(filter):await postsCollection.countDocuments()
        const postsWithPaginator: Paginator<PostViewModel> = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: posts
        }
        return postsWithPaginator
    },
    async findBlogPosts(blogId: string, sortBy: keyof  PostViewModel, sortDirection: keyof typeof SortDirections, pageNumber: number, pageSize: number): Promise<Paginator<PostViewModel>> {
        let sortDir=-1
        sortDirection === 'asc' ? sortDir = 1 : sortDir = -1
        const sortConfig = {[sortBy]: sortDir}
        // @ts-ignore
        const posts = await postsCollection.find({blogId}, {projection: {_id: false}}).sort(sortConfig).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        const totalCount = await postsCollection.countDocuments({blogId})
        const blogPostsWithPaginator: Paginator<PostViewModel> = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: posts
        }
        return blogPostsWithPaginator
    },
    async findPost(id: string): Promise<PostViewModel | null> {
        const post = postsCollection.findOne({id}, {projection: {_id: false}})
        return post
    },
    async findNewlyCreatedPost(id: ObjectId): Promise<PostViewModel | null> {
        const post = postsCollection.findOne({_id: id}, {projection: {_id: false}})
        return post
    },
    async deleteAll() {
        await postsCollection.deleteMany({})
    }
}