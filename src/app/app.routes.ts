import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './core/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { MainLayoutComponent } from './core/layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home.component';
import { NoteDetailsComponent } from './features/note-details/note-details.component';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    {
        path: '', component: AuthLayoutComponent, children: [
            { path: 'logIn', component: LoginComponent, title: 'Login' },
            { path: 'register', component: RegisterComponent, title: 'Register' }
        ]
    },

    {
        path: '', component: MainLayoutComponent, children: [
            { path: 'home', component: HomeComponent, title: 'Home' },
            { path: 'noteDetails', component: NoteDetailsComponent, title: 'Note Details' }
        ]
    },
    { path: '**', component: NotFoundComponent, title: '404' }
];
