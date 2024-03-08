import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LinkService } from '../../services/link.service';
import { Link } from '../../interfaces/link';


@Component({
  selector: 'app-links',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, RouterModule, MatButtonModule],
  templateUrl: './links.component.html',
  styleUrl: './links.component.css'
})
export class LinksComponent implements OnInit {
  columns = ['id', 'code', 'count', 'revenue']
  dataSource = new MatTableDataSource();
  id!: number

  constructor(private linkService: LinkService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.linkService.all(this.id).then(e => {
      if (e.success) this.dataSource.data = e.links!
      else console.log(e);
    })
  }

  link_revenue(link: Link) {
    return link.orders.reduce((s, o) => s + o.total, 0)
  }

}
