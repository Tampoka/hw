import {randomUUID} from 'crypto';
import {Paginator} from '../repo/blogs-repo';
import {InsertOneResult, ObjectId} from 'mongodb';
import {SortDirections, UserViewModel} from '../../db/db';
import {UserDBModel, usersRepo} from '../repo/users-repo';
import bcrypt from 'bcrypt';


export type UserInputModel = {
    "login": string
    "password": string
    "email": string
}
export const usersService = {
    // @ts-ignore
    async findUsers(login?: string,email?:string, sortBy: string , sortDirection: keyof typeof SortDirections, pageNumber: number, pageSize: number): Promise<Paginator<UserViewModel>> {
        return usersRepo.findUsers(login,email, sortBy, sortDirection, pageNumber, pageSize)
    },
    // async findNewlyCreatedUser(id: ObjectId): Promise<UserViewModel | null> {
    //     return usersRepo.findNewlyCreatedUser(id)
    // },
    async createUser(login: string, email: string, password: string): Promise<UserViewModel> {
        const passwordSalt=await bcrypt.genSalt(10);
        const passwordHash=await this._generateHash(password, passwordSalt)
        const newUser: UserDBModel = {
            id: randomUUID(),
            login,
            password,
            passwordHash,
            passwordSalt,
            email,
            createdAt: (new Date().toISOString()),
        }
        return usersRepo.createUser(newUser)
    },
    async checkCredentials(loginOrEmail:string, password: string): Promise<UserDBModel | boolean> {
        const user=await usersRepo.findUserByLoginOrEmail(loginOrEmail)
        if(!user) return false
        const passwordHash=await this._generateHash(password, user.passwordSalt)
        return passwordHash === user.passwordHash;

    },
    // async updateUser(id: string, valuesToUpdate: UserViewModel): Promise<UserViewModel | boolean | null> {
    //     return usersRepo.updateBlog(id, valuesToUpdate)
    // },
    // async deleteUser(id: string): Promise<boolean> {
    //     return await usersRepo.deleteBlog(id)
    // },
    async deleteAll(): Promise<void> {
        await usersRepo.deleteAll()
    },
    async _generateHash(password:string, salt:string):Promise<string>{
        return await bcrypt.hash(password, salt)
    }
}