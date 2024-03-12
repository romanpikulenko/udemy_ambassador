import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { Emitters } from '../../emitters/emitters';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  title = "Welcome"
  description = "Share links to earn money"
  private _user?: User | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    this.user = this.authService.authenticatedUser;

    Emitters.authEmitter.subscribe(e => {
      this.user = e
    })
  }

  public get user(): User | undefined {
    return this._user;
  }
  public set user(value: User | undefined) {
    this._user = value;

    if (this._user) {
      this.title = "$" + this._user.revenue
      this.description = 'You have earned this far'
    }
    else {
      this.title = "Welcome"
      this.description = "Share links to earn money"
    }
  }
}
