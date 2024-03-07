import { Routes } from '@angular/router';
import { SecureComponent } from './secure/secure.component';
import { LoginComponent } from './public/login/login.component';
import { RegisterComponent } from './public/register/register.component';
import { PublicComponent } from './public/public.component';
import { ProfileComponent } from './secure/profile/profile.component';
import { UsersComponent } from './secure/users/users.component';

export const routes: Routes = [
    {
        path: '', component: SecureComponent,
        children: [
            { path: "", pathMatch: "full", redirectTo: 'users' },
            { path: "profile", component: ProfileComponent },
            { path: "users", component: UsersComponent }
        ]
    },
    {
        path: '', component: PublicComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    }
];
