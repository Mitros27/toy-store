import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Loading } from '../loading/loading';
import { MatChipsModule } from '@angular/material/chips';
import { ToyModel } from '../../model/toy.model'
import { ToyService } from '../services/toy.service'
import { AuthService } from '../services/auth.service'
import { CartService } from '../services/cart.service'
import { Utils } from '../utils'
import { Alerts } from '../alerts'

@Component({
  selector: 'app-toy-details',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, Loading],
  templateUrl: './toy-details.html',
  styleUrl: './toy-details.scss',
})
export class ToyDetails {
  toy = signal<ToyModel | null>(null)
  authService = AuthService
  constructor(private route: ActivatedRoute, public utils: Utils) {
    this.route.params.subscribe(params => {
      const id = params['id']
      ToyService.getToyById(id)
        .then(rsp => {
          this.toy.set(rsp.data)
        })
    })
  }
  addToCart() {
    const toy = this.toy()
    if (toy) {
      CartService.addToCart(toy)
      Alerts.success('toy added to cart! ')
    }
  }
}
