import { ToyModel } from './toy.model'

export enum CartStatus {
    REZERVISANO = 'rezervisano',
    PRISTIGLO = 'pristiglo',
    OTKAZANO = 'otkazano'
}

export interface CartItemModel {
    orderId: string
    toy: ToyModel
    quantity: number
    status: CartStatus
    rating: number | null
    addedAt: string
    paidAt?: string
}

export interface UserModel {
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
    address: string
    favoriteToyTypes: string[]
    cart: CartItemModel[]
    orders?: CartItemModel[]
}