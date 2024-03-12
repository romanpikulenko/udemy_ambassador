import { Component, OnInit } from '@angular/core';
import { NavComponent } from './nav/nav.component';
import { AuthService } from '../services/auth.service';
import { Emitters } from '../emitters/emitters';
import { User } from '../interfaces/user';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NavComponent, RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  user?: User
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    Emitters.authEmitter.subscribe(e => this.user = e)

    this.authService.user().then(e => {
      console.log(e)
    })
  }
}
