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

export const blogsRepo = {
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
        const foundBlogs= await blogsCollection.find(filter).count()
        const totalCount=name?foundBlogs:await blogsCollection.countDocuments()
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