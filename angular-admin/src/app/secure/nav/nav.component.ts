import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {
  user?: User

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userAsync()
      .then(e => {
        if (e.success) this.user = e.User
        else console.log(e.responseAnswer)
      })
  }
}
