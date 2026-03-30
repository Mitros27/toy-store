import { ToyModel } from "../../model/toy.model"
import { CartItemModel, CartStatus, UserModel } from "../../model/user.model"
import { AuthService } from "./auth.service"

export class CartService {
    static getCart(): CartItemModel[] {
        const user = AuthService.getActiveUser()
        if (user && user.cart) {
            return user.cart
        }
        return []
    }

    static addToCart(toy: ToyModel) {
        const user = AuthService.getActiveUser()
        if (!user) return

        if (!user.cart) {
            user.cart = []
        }

        const existingItem = user.cart.find(item => item.toy.toyId === toy.toyId)

        if (existingItem) {
            existingItem.quantity++
        } else {
            const newItem: CartItemModel = {
                orderId: crypto.randomUUID(),
                toy: toy,
                quantity: 1,
                status: CartStatus.REZERVISANO,
                rating: null,
                addedAt: new Date().toISOString()
            }
            user.cart.push(newItem)
        }
        CartService.saveCart(user.cart)
    }

    static removeFromCart(toyId: number) {
        const user = AuthService.getActiveUser()
        if (!user || !user.cart) return

        user.cart = user.cart.filter(item => item.toy.toyId !== toyId)
        CartService.saveCart(user.cart)
    }

    static updateItemStatus(toyId: number, newStatus: CartStatus) {
        const user = AuthService.getActiveUser()
        if (!user || !user.cart) return

        for (let item of user.cart) {
            if (item.toy.toyId === toyId) {
                item.status = newStatus
            }
        }
        CartService.saveCart(user.cart)
    }

    static rateItem(toyId: number, rating: number) {
        const user = AuthService.getActiveUser()
        if (!user || !user.cart) return

        for (let item of user.cart) {
            if (item.toy.toyId === toyId && item.status === CartStatus.PRISTIGLO) {
                item.rating = rating
            }
        }
        CartService.saveCart(user.cart)
    }

    static getTotalPrice(): number {
        const cart = CartService.getCart()
        let total = 0
        for (let item of cart) {
            total += item.toy.price * item.quantity
        }
        return total
    }

    static saveCart(cart: CartItemModel[]) {
        const users = AuthService.getUsers()
        const activeEmail = localStorage.getItem('active')

        for (let u of users) {
            if (u.email === activeEmail) {
                u.cart = cart
            }
        }
        localStorage.setItem('users', JSON.stringify(users))
    }
    static updateQuantity(toyId: number, change: number) {
        const user = AuthService.getActiveUser()
        if (!user || !user.cart) return

        for (let item of user.cart) {
            if (item.toy.toyId === toyId) {
                item.quantity += change
                if (item.quantity < 1) {
                    item.quantity = 1
                }
            }
        }
        CartService.saveCart(user.cart)
    }
    static checkout() {
        const user = AuthService.getActiveUser()
        if (!user || !user.cart || user.cart.length === 0) return

        if (!user.orders) {
            user.orders = []
        }

   
        const groupedItems: { [key: number]: CartItemModel } = {}

        for (let item of user.cart) {
            const toyId = item.toy.toyId
            if (groupedItems[toyId]) {
                groupedItems[toyId].quantity += item.quantity
            } else {
                groupedItems[toyId] = {
                    ...item,
                    orderId: crypto.randomUUID(),
                    status: CartStatus.REZERVISANO,
                    paidAt: new Date().toISOString()
                }
            }
        }

  
        for (let toyId in groupedItems) {
            user.orders.push(groupedItems[toyId])
        }

        user.cart = []
        CartService.saveUserData(user)
    }

    static saveUserData(user: UserModel) {
        const users = AuthService.getUsers()
        const activeEmail = localStorage.getItem('active')

        for (let u of users) {
            if (u.email === activeEmail) {
                u.cart = user.cart
                u.orders = user.orders
            }
        }
        localStorage.setItem('users', JSON.stringify(users))
    }
}