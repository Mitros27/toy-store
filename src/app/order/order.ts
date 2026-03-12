import { Component, Input, Output, EventEmitter } from '@angular/core'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'

import { CartItemModel, CartStatus } from '../../model/user.model'
import { Utils } from '../utils'

@Component({
  selector: 'app-order',
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './order.html',
  styleUrl: './order.scss'
})
export class Order {
  @Input() item!: CartItemModel
  @Input() showActions: boolean = true
  @Output() statusChanged = new EventEmitter<CartStatus>()
  @Output() rated = new EventEmitter<number>()

  CartStatus = CartStatus
  stars = [1, 2, 3, 4, 5]

  constructor(public utils: Utils) { }

  markAsArrived() {
    this.statusChanged.emit(CartStatus.PRISTIGLO)
  }

  cancelOrder() {
    this.statusChanged.emit(CartStatus.OTKAZANO)
  }

  rate(rating: number) {
    this.rated.emit(rating)
  }
}