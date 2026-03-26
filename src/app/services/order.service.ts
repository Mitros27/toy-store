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

    static updateOrderStatus(orderId: string, newStatus: CartStatus) {
        const user = AuthService.getActiveUser()
        if (!user || !user.orders) return

        for (let order of user.orders) {
            if (order.orderId === orderId) {
                order.status = newStatus
            }
        }
        OrderService.saveOrders(user.orders)
    }

    static rateOrder(orderId: string, rating: number) {
        const user = AuthService.getActiveUser()
        if (!user || !user.orders) return

        for (let order of user.orders) {
            if (order.orderId === orderId && order.status === CartStatus.PRISTIGLO) {
                order.rating = rating
            }
        }
        OrderService.saveOrders(user.orders)
    }

    static getAverageRatingForToy(toyId: number): number | null {
        const users = AuthService.getUsers()

        const ratings: number[] = []
        for (let user of users) {
            if (!user.orders) continue
            for (let order of user.orders) {
                if (order.toy.toyId === toyId && order.status === CartStatus.PRISTIGLO && order.rating !== null) {
                    ratings.push(order.rating!)
                }
            }
        }

        if (ratings.length === 0) return null

        let sum = 0
        for (let r of ratings) {
            sum += r
        }
        return Number((sum / ratings.length).toFixed(1))
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