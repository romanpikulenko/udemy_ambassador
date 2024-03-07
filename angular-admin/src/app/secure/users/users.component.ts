import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { User } from '../../interfaces/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users: User[] = []

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.userService.all().then(e => {
      if (e.success) this.users = e.users!
      else console.log(e)
    })
  }

}
