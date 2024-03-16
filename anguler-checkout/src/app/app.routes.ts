import { Routes } from '@angular/router';
import { SuccessComponent } from './success/success.component';
import { ErrorComponent } from './error/error.component';
import { FormComponent } from './form/form.component';

export const routes: Routes = [
    { path: 'success', component: SuccessComponent, },
    { path: 'error', component: ErrorComponent, },
    { path: ':code', component: FormComponent, },
];
