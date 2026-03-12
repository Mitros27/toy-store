import { Component, signal } from '@angular/core'
import { Router } from '@angular/router'
import { FormsModule } from '@angular/forms'
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatExpansionModule } from '@angular/material/expansion'

import { AuthService } from '../services/auth.service'
import { ToyService } from '../services/toy.service'
import { OrderService } from '../services/order.service'
import { UserModel } from '../../model/user.model'
import { ToyTypeModel } from '../../model/toy.model'
import { Alerts } from '../alerts'

@Component({
  selector: 'app-user',
  imports: [
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatExpansionModule
  ],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User {
  user = signal<UserModel | null>(null)
  types = signal<ToyTypeModel[]>([])

  firstName: string = ''
  lastName: string = ''
  phone: string = ''
  address: string = ''
  favoriteToyTypes: string[] = []

  oldPassword: string = ''
  newPassword: string = ''
  repeatPassword: string = ''

  constructor(private router: Router) {
    const activeUser = AuthService.getActiveUser()
    if (activeUser) {
      this.user.set(activeUser)
      this.firstName = activeUser.firstName
      this.lastName = activeUser.lastName
      this.phone = activeUser.phone
      this.address = activeUser.address
      this.favoriteToyTypes = activeUser.favoriteToyTypes || []
    } else {
      this.router.navigate(['/login'])
    }
    this.loadTypes()
  }

  async loadTypes() {
    const response = await ToyService.getTypes()
    this.types.set(response.data)
  }

  getAvatarUrl() {
    const user = this.user()
    if (user) {
      return `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=00bcd4&color=fff&size=80`
    }
    return ''
  }

  getTotalOrders(): number {
    return OrderService.getOrders().length
  }

  isFavorite(typeName: string): boolean {
    return this.favoriteToyTypes.includes(typeName)
  }

  toggleFavorite(typeName: string) {
    if (this.isFavorite(typeName)) {
      this.favoriteToyTypes = this.favoriteToyTypes.filter(t => t !== typeName)
    } else {
      this.favoriteToyTypes.push(typeName)
    }
  }

  changePassword() {
    Alerts.confirm('Are you sure you want to change the password?', () => {
      const user = this.user()

      if (this.oldPassword !== user?.password) {
        Alerts.error('Invalid old password')
        return
      }
      if (this.newPassword.length < 6) {
        Alerts.error('Password must be at least 6 characters long')
        return
      }
      if (this.newPassword !== this.repeatPassword) {
        Alerts.error('Passwords do not match')
        return
      }
      if (this.newPassword === user?.password) {
        Alerts.error('New password cannot be the same as the old one')
        return
      }

      AuthService.updateActiveUserPassword(this.newPassword)
      Alerts.success('Password updated successfully')
      AuthService.logout()
      this.router.navigate(['/login'])
    })
  }

  updateProfile() {
    const currentUser = this.user()
    if (currentUser) {
      currentUser.firstName = this.firstName
      currentUser.lastName = this.lastName
      currentUser.phone = this.phone
      currentUser.address = this.address
      currentUser.favoriteToyTypes = this.favoriteToyTypes

      AuthService.updateActiveUser(currentUser)
      this.user.set({ ...currentUser })
      Alerts.success('Profile updated successfully!')
    }
  }

  logout() {
    Alerts.confirm('Do you want to logout?', () => {
      AuthService.logout()
      this.router.navigate(['/'])
    })
  }
}