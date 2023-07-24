import {blogsCollection, BlogViewModel, SortDirections} from '../../db/db';
import {InsertOneResult, ObjectId} from 'mongodb';


export type BlogInputModel = {
    "name": string
    "description": string
    "websiteUrl": string
}
export type Paginator<T> = {
    pagesCount?: number
    page?: number
    pageSize?: number
    totalCount?: number
    items: T[]
}

export const blogsQueryRepo = {
// @ts-ignore
    async findBlogs(name?: string,sortBy: string, sortDirection: keyof typeof SortDirections, pageNumber: number, pageSize: number): Promise<Paginator<BlogViewModel>> {
        const filter: any = {}
        if (name) {
            filter.name = {$regex: name, $options: 'i'}
        }
        let sortDir=-1
        sortDirection === 'asc' ? sortDir = 1 : sortDir = -1
        const sortConfig = {[sortBy]: sortDir}
        // @ts-ignore
        const blogs= await blogsCollection.find(filter, {projection: {_id: false}}).sort(sortConfig).skip( ( pageNumber - 1 ) * pageSize  ).limit(pageSize).toArray()
        const totalCount =name? await blogsCollection.countDocuments(filter):await blogsCollection.countDocuments()
        const blogsWithPagination:Paginator<BlogViewModel>={
            pagesCount:Math.ceil(totalCount/pageSize),
            page:pageNumber,
            pageSize:pageSize,
            totalCount:totalCount,
            items:blogs
        }
        return blogsWithPagination
    },
    async findBlog(id: string): Promise<BlogViewModel | null> {
        const blog = blogsCollection.findOne({id}, {projection: {_id: false}})
        return blog
    },
    async findNewlyCreatedBlog(id: ObjectId): Promise<BlogViewModel | null> {
        const blog = blogsCollection.findOne({_id:id}, {projection: {_id: false}})
        return blog
    },
    async deleteAll(): Promise<void> {
        await blogsCollection.deleteMany({})
    }
}