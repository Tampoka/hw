import {blogsRepo} from './blogs-repo';
import crypto from 'crypto';
const uuid = crypto.randomUUID({disableEntropyCache: true})

export type PostViewModel = {
    id: string
    "blogId": string
    "blogName": string
    "title": string
    "shortDescription": string
    "content": string
}
export type PostInputModel = {
    "title": string
    "blogId": string
    "shortDescription": string
    "content": string
}

let postsData: PostViewModel[] = [{
    id: '1',
    title: 'Pizza',
    shortDescription: 'Cooking western cuisine',
    content: 'tra ta ta',
    blogId: '1',
    blogName: 'Cooking',
},
    {
        id: '2',
        title: 'Favorite books',
        shortDescription: 'Science fiction is my addiction',
        content: 'bla bla',
        blogId: '2',
        blogName: 'Karate',
    },
]

export const postsRepo = {
    findPosts() {
        return postsData
    },
    findPost(id: string) {
        return postsData!.find(el => el.id === id)
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const blogName = blogsRepo.findBlog(blogId)?.name
        if (blogName) {
            const newPost: PostViewModel = {
                id: uuid,
                title,
                shortDescription,
                content,
                blogId,
                blogName
            }
            postsData.push(newPost)
            return newPost
        } else {
            return false
        }
    },
    updatePost(id: string, valuesToUpdate: PostInputModel) {
        const post = postsData!.find(el => el.id === id)
        if (post) {
            post.title = valuesToUpdate.title || post.title
            post.shortDescription = valuesToUpdate.shortDescription || post.shortDescription
            post.content = valuesToUpdate.content || post.content
            return post
        } else {
            return false
        }
    },
    deletePost(id: string) {
        let index = postsData!.findIndex(el => el.id === id)
        if (index > -1) {
            postsData!.splice(index, 1)
            return true
        } else {
            return false
        }
    },
    deleteBlogAllPosts(id: string) {
     const postsToDelete=postsData.filter(p=>p.blogId===id)
        postsToDelete.forEach(x => postsData.splice(postsData.findIndex(n => n === x), 1));
    },
    deleteAll() {
        postsData = []
    }
}