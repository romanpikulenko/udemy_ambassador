import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { Emitters } from '../../emitters/emitters';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  user?: User

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.user = this.authService.authenticatedUser

    Emitters.authEmitter.subscribe(e => this.user = e)
  }

  logout() {
    this.authService.logout().then(e => {
      console.log(e)
    })
  }
}
