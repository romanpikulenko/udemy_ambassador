import { Component, OnInit } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { AuthService } from '../services/auth.service';
import { Emitters } from '../emitters/emitters';
import { User } from '../interfaces/user';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NavComponent, RouterModule, HeaderComponent, CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  user?: User
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe(e => this.user = e)

    this.authService.user().then(e => {
      console.log(e)
    })
  }

  isMainPage() {
    const url = this.router.url

    return url === '/' || url === '/backend'
  }
}
