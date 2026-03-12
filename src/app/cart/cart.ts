import { Component, signal } from '@angular/core'
import { Router, RouterLink } from '@angular/router'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { CartItemModel } from '../../model/user.model'
import { CartService } from '../services/cart.service'
import { Utils } from '../utils'
import { Alerts } from '../alerts'

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart {
  cartItems = signal<CartItemModel[]>([])
  totalPrice = signal<number>(0)

  constructor(public utils: Utils, private router: Router) {
    this.loadCart()
  }

  loadCart() {
    this.cartItems.set([...CartService.getCart()])
    this.totalPrice.set(CartService.getTotalPrice())
  }

  removeItem(toyId: number) {
    Alerts.confirm('Do you want to remove this item from cart?', () => {
      CartService.removeFromCart(toyId)
      this.loadCart()
      Alerts.success('Item removed from cart!')
    })
  }

  updateQuantity(toyId: number, change: number) {
    CartService.updateQuantity(toyId, change)
    this.loadCart()
  }

  checkout() {
    CartService.checkout()
    this.loadCart()
    Alerts.success('Payment successful!')
    this.router.navigate(['/orders'])
  }
}