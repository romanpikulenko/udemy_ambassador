import { Routes } from '@angular/router';
import { SecureComponent } from './secure/secure.component';
import { LoginComponent } from './public/login/login.component';
import { RegisterComponent } from './public/register/register.component';
import { PublicComponent } from './public/public.component';

export const routes: Routes = [
    {
        path: '', component: SecureComponent,
    },
    {
        path: '',
        component: PublicComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    }
];
