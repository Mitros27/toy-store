import { CartItemModel, CartStatus } from '../../model/user.model'
import { AuthService } from './auth.service'

export class OrderService {
    static getOrders(): CartItemModel[] {
        const user = AuthService.getActiveUser()
        if (user && user.orders) {
            return user.orders
        }
        return []
    }

    static updateOrderStatus(toyId: number, newStatus: CartStatus) {
        const user = AuthService.getActiveUser()
        if (!user || !user.orders) return

        for (let order of user.orders) {
            if (order.toy.toyId === toyId) {
                order.status = newStatus
            }
        }
        OrderService.saveOrders(user.orders)
    }

    static rateOrder(toyId: number, rating: number) {
        const user = AuthService.getActiveUser()
        if (!user || !user.orders) return

        for (let order of user.orders) {
            if (order.toy.toyId === toyId && order.status === CartStatus.PRISTIGLO) {
                order.rating = rating
            }
        }
        OrderService.saveOrders(user.orders)
    }

    static saveOrders(orders: CartItemModel[]) {
        const users = AuthService.getUsers()
        const activeEmail = localStorage.getItem('active')

        for (let u of users) {
            if (u.email === activeEmail) {
                u.orders = orders
            }
        }
        localStorage.setItem('users', JSON.stringify(users))
    }
}