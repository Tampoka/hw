import crypto from 'crypto';

const uuid = crypto.randomUUID({disableEntropyCache: true})

export type BlogViewModel = {
    "id": string
    "name": string
    "description": string
    "websiteUrl": string
}
export type BlogInputModel = {
    "name": string
    "description": string
    "websiteUrl": string
}

let blogsData: BlogViewModel[] = [{
    id: '1',
    name: 'Cooking',
    description: 'Cooking western cuisine',
    websiteUrl: 'https://dimychblog.com',

},
    {
        id: '2',
        name: 'Karate',
        description: 'Everything about martial arts',
        websiteUrl: 'https://karate.com',

    },
]

export const blogsRepo = {
    findBlogs() {
        return blogsData
    },
    findBlog(id: string) {
        const blog = blogsData.find(el => el.id === id)
        if (blog) {
            return blog
        } else {
            return false
        }
    },
    createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog: BlogViewModel = {
            id: uuid,
            name,
            description,
            websiteUrl
        }
        blogsData.push(newBlog)
        return newBlog
    },
    updateBlog(id: string, valuesToUpdate: BlogInputModel) {
        const blog = blogsData!.find(el => el.id === id)
        if (blog) {
            blog.name = valuesToUpdate.name || blog.name
            blog.description = valuesToUpdate.description || blog.description
            blog.websiteUrl = blog.websiteUrl || blog.websiteUrl

            return blog
        } else {
            return false
        }
    },
    deleteBlog(id: string) {
        let index = blogsData!.findIndex(el => el.id === id)
        if (index !== -1) {
            blogsData.splice(index, 1)
            return true
        } else {
            return false
        }
    },
    deleteAll() {
        blogsData = []
    }
}