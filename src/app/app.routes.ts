import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { authGuard } from './core/guards/auth-guard';
import { loggedInGuard } from './core/guards/logged-in-guard';
import { AccountComponent } from './features/account/account.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: '', component: AuthLayoutComponent, children: [
            { path: 'login', component: LoginComponent, title: 'Login' },
            { path: 'register', component: RegisterComponent, title: 'Register' }
        ],
        canActivate: [loggedInGuard]
    },

    {
        path: '', component: MainLayoutComponent, children: [
            { path: 'home', component: HomeComponent, title: 'Home' },
            { path: 'account', component: AccountComponent, title: 'User Accont' }
        ],
        canActivate: [authGuard]
    },
    { path: '**', component: NotFoundComponent, title: '404' }
];
