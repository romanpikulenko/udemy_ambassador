import { Routes } from '@angular/router';
import { PublicComponent } from './public/public.component';
import { LoginComponent } from './public/login/login.component';
import { RegisterComponent } from './public/register/register.component';
import { MainComponent } from './main/main.component';
import { SecureComponent } from './main/secure/secure.component';
import { ProfileComponent } from './main/secure/profile/profile.component';
import { FrontedProductsComponent } from './main/fronted-products/fronted-products.component';
import { StatsComponent } from './main/secure/stats/stats.component';
import { RankingsComponent } from './main/secure/rankings/rankings.component';
import { BackendProductsComponent } from './main/backend-products/backend-products.component';

export const routes: Routes = [
    {
        path: '', component: MainComponent,
        children: [
            { path: '', component: FrontedProductsComponent },
            { path: 'backend', component: BackendProductsComponent },
            {
                path: '', component: SecureComponent,
                children: [
                    { path: "profile", component: ProfileComponent },
                    { path: "stats", component: StatsComponent },
                    { path: "rankings", component: RankingsComponent }
                ]
            }
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
