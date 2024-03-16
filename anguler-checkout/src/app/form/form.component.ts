import { Component, OnInit } from '@angular/core';
import { LinkService } from '../services/link.service';
import { ActivatedRoute } from '@angular/router';
import { Link } from '../interfaces/link';
import { CommonModule } from '@angular/common';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  code = ''
  link?: Link
  products: Product[] = []
  user?: User

  constructor(private linkService: LinkService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.code = this.route.snapshot.params['code']
    this.linkService.get(this.code).then(e => {
      if (e.success) {
        this.link = e.links![0]
        this.products = this.link!.products
        this.user = this.link!.user
      }
      else console.log(e)
    })
  }
}
