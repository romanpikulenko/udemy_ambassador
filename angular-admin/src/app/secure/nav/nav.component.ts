import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  user?: User

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userAsync()
      .then(e => {
        if (e.success) this.user = e.user
        else console.log(e.responseBody)
      })
  }

  logout() {
    this.authService.logoutAsync().then(e => console.log(e))
  }
}
