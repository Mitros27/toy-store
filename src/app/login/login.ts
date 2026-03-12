import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, MatCardModule,MatInputModule,MatButtonModule,MatIconModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email: string = 'user@example.com'
  password: string = 'user123'
  errorMessage: string=''
  constructor(private router: Router){}
  doLogin(){
    if(AuthService.login(this.email, this.password)){
      this.router.navigate(['/'])
    }else{
      this.errorMessage = 'Invalid email or password'
    }
  }
}
