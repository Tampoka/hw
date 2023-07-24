import {postsCollection, PostViewModel} from '../../db/db';
import {InsertOneResult} from 'mongodb';
import {PostInputModel} from '../domain/posts-service';

export const postsRepo = {
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