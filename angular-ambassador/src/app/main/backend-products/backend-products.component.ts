import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/products.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backend-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backend-products.component.html',
  styleUrl: './backend-products.component.css'
})
export class BackendProductsComponent implements OnInit {
  products: Product[] = []
  page = 1
  last_page_reached = false

  constructor(private productsService: ProductService) { }

  ngOnInit(): void {
    this.productsService.all_backend().then(e => {
      if (e.success) {
        this.products = e.products!
        this.page = e.meta!.page
        this.last_page_reached = e.meta!.page >= e.meta!.last_page
      }
      else console.log(e)
    })
  }
  loadMore() {
    this.page++;

    this.productsService.all_backend({ page: this.page }).then(e => {
      if (e.success) {
        this.products = this.products.concat(e.products!)
        this.page = e.meta!.page
        this.last_page_reached = e.meta!.page >= e.meta!.last_page
      }
      else console.log(e)
    })
  }
}
