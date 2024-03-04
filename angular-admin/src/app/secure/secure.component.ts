import { Component } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-secure',
  standalone: true,
  imports: [NavComponent, MenuComponent],
  templateUrl: './secure.component.html',
  styleUrl: './secure.component.css'
})
export class SecureComponent {

}
