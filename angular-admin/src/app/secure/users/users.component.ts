import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, RouterModule, MatButtonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit, AfterViewInit {
  columns = ['id', 'name', 'email', 'actions']
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(private userService: UsersService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit(): void {
    this.userService.all().then(e => {
      if (e.success) this.dataSource.data = e.users!
      else console.log(e)
    })
  }

}
