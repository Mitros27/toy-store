import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserModel } from '../../model/user.model';
import { User } from '../user/user';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  firstName: string = ''
  lastName: string = ''
  email: string = ''
  password: string = ''
  phone: string = ''
  address: string = ''
  errorMessage: string = ''
  constructor(private router: Router) { }
  doRegister() {
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.phone || !this.address) {
      this.errorMessage = 'Please fill in all fields'
      return
    }

    const newUser: UserModel = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phone: this.phone,
      address: this.address,
      favoriteToyTypes: [],
      cart: []
    }

    if (AuthService.register(newUser)) {
      this.router.navigate(['/login'])
    } else {
      this.errorMessage = 'Email already exists'
    }
  }

}
