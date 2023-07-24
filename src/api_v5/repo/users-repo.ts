import {SortDirections, usersCollection, UserViewModel} from '../../db/db';

export type Paginator<T> = {
    pagesCount?: number
    page?: number
    pageSize?: number
    totalCount?: number
    items: T[]
}
export type UserDBModel = {
    id: string
    "login": string
    "password": string
    passwordHash: string
    passwordSalt: string
    "email": string
    createdAt: string
}
export const usersRepo = {
// @ts-ignore
    async findUsers(login?: string, email?: string, sortBy: string, sortDirection: keyof typeof SortDirections, pageNumber: number, pageSize: number): Promise<Paginator<UserViewModel>> {
        let sortDir = -1
        sortDirection === 'asc' ? sortDir = 1 : sortDir = -1
        const sortConfig = {[sortBy]: sortDir}
        // @ts-ignore
        const users = await usersCollection.find({$or: [{userName: login}, {email: email}]}, {projection: {_id: false}}).sort(sortConfig).skip((pageNumber - 1) * pageSize).limit(pageSize).toArray()
        const totalCount = await usersCollection.countDocuments({$or: [{userName: login}, {email: email}]})
        const foundUsers=users.map(user=>this._mapToUserViewModel(user))
        const usersWithPagination: Paginator<UserViewModel> = {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: foundUsers
        }
        return usersWithPagination
    },
    async createUser(newUser: UserDBModel): Promise<UserViewModel> {
       const userId= usersCollection.insertOne(newUser)
        const user = usersCollection.findOne({id: userId}, {projection: {_id: false}})
        if(user)        {
            return this._mapToUserViewModel(user)
        }
    },
    // async findNewlyCreatedUser(id: string):Promise<UserViewModel> {
    //     const user = usersCollection.findOne({id}, {projection: {_id: false}})
    //     if(user) {
    //         return {
    //             id: user._id,
    //             login: user.login,
    //             email: user.email,
    //             createdAt: user.createdAt
    //         }
    //     }
    // },
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const user = usersCollection.findOne({$or: [{userName: loginOrEmail}, {email: loginOrEmail}]}, {projection: {_id: false}})
        if (user) {
            return user
        } else {
            return null
        }
    },
/*    async updateUser(id: string, valuesToUpdate: UserInputModel): Promise<UserDBModel | boolean | null> {
        const result = await usersCollection.updateOne({id}, {
            $set: {
                name: valuesToUpdate.name,
                description: valuesToUpdate.description,
                websiteUrl: valuesToUpdate.websiteUrl
            }
        })
        if (result.matchedCount === 1) {
            return await usersCollection.findOne({id}, {projection: {_id: false}})
        } else {
            return false
        }
    },*/
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({id})
        return result.deletedCount === 1;

    },
    async deleteAll(): Promise<void> {
        await usersCollection.deleteMany({})
    },
    _mapToUserViewModel(user: any): UserViewModel {
        return {
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}