import { Component, OnInit } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { MenuComponent } from './menu/menu.component';
import { AuthService } from '../services/auth.service';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-secure',
  standalone: true,
  imports: [NavComponent, MenuComponent, RouterOutlet],
  templateUrl: './secure.component.html',
  styleUrl: './secure.component.css'
})
export class SecureComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.userAxios().then(e => {
      console.log("Secure component")
      if (!e.success) this.router.navigate(['/login'])
    })
  }
}
