import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ToyDetails } from './toy-details/toy-details';
import { Login } from './login/login';
import { Register } from './register/register';
import { User } from './user/user';
import { Cart } from './cart/cart';
import { Orders } from './orders/orders';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'toy/:id', component: ToyDetails },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'user', component: User },
    { path: 'cart', component: Cart },
    { path: 'orders', component: Orders }



];
