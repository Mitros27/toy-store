import { UserModel } from "../../model/user.model";
import { CartItemModel } from "../../model/user.model";
import { CartStatus } from "../../model/user.model";
const USERS = 'users'
const ACTIVE = 'active'
export class AuthService {
    static getUsers(): UserModel[] {
        const baseUser: UserModel = {
            firstName: 'Milos',
            lastName: 'Mitrovic',
            email: 'user@example.com',
            password: 'user123',
            phone: '0621603116',
            address: 'Janka Misica 22',
            favoriteToyTypes: ['Slagalica', 'Figura'],
            cart: []
        }
        if (localStorage.getItem(USERS) === null) {
            localStorage.setItem(USERS, JSON.stringify([baseUser]))
        }
        return JSON.parse(localStorage.getItem(USERS)!)
    }
    static login(email: string, password: string): boolean {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === email && u.password === password) {
                localStorage.setItem(ACTIVE, email)
                return true
            }
        }
        return false

    }
    static getActiveUser(): UserModel | null {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                return u
            }
        }
        return null
    }
    static logout(): void {
        localStorage.removeItem(ACTIVE)
    }
    static register(newUser: UserModel): boolean {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === newUser.email) {
                return false
            }
        }
        newUser.cart = []
        users.push(newUser)
        localStorage.setItem(USERS, JSON.stringify(users))
        return true
    }
    static updateActiveUser(newUserData: UserModel): void {
        const users = this.getUsers()
        const email = localStorage.getItem(ACTIVE)
        for (let u of users) {
            if (u.email === email) {
                u.firstName = newUserData.firstName
                u.lastName = newUserData.lastName
                u.address = newUserData.address
                u.phone = newUserData.phone
                u.favoriteToyTypes = newUserData.favoriteToyTypes
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }
    static updateActiveUserPassword(newPassword: string) {
        const users = this.getUsers()
        for (let u of users) {
            if (u.email === localStorage.getItem(ACTIVE)) {
                u.password = newPassword
            }
        }
        localStorage.setItem(USERS, JSON.stringify(users))
    }
}