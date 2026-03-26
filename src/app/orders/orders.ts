import { Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { CartItemModel, CartStatus } from '../../model/user.model'
import { OrderService } from '../services/order.service'
import { Order } from '../order/order'
import { Alerts } from '../alerts'

@Component({
  selector: 'app-orders',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    Order
  ],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders {
  paidOrders = signal<CartItemModel[]>([])
  arrivedOrders = signal<CartItemModel[]>([])
  cancelledOrders = signal<CartItemModel[]>([])

  constructor() {
    this.loadOrders()
  }

  loadOrders() {
    const orders = OrderService.getOrders()
    this.paidOrders.set(orders.filter(o => o.status === CartStatus.REZERVISANO))
    this.arrivedOrders.set(orders.filter(o => o.status === CartStatus.PRISTIGLO))
    this.cancelledOrders.set(orders.filter(o => o.status === CartStatus.OTKAZANO))
  }

  onStatusChanged(orderId: string, newStatus: CartStatus) {
    if (newStatus === CartStatus.OTKAZANO) {
      Alerts.confirm('Do you want to cancel this order?', () => {
        OrderService.updateOrderStatus(orderId, newStatus)
        this.loadOrders()
        Alerts.success('Order cancelled!')
      })
    } else {
      OrderService.updateOrderStatus(orderId, newStatus)
      this.loadOrders()
      if (newStatus === CartStatus.PRISTIGLO) {
        Alerts.success('Order marked as arrived!')
      }
    }
  }

  onRated(orderId: string, rating: number) {
    OrderService.rateOrder(orderId, rating)
    this.loadOrders()
    Alerts.success('Thank you for your rating!')
  }
}