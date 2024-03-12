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
  showLoadMore = false
  s?: string


  constructor(private productsService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts(false);
  }
  loadMore() {
    this.page++;
    this.loadProducts(false);
  }
  search(s: string) {
    this.s = s
    this.page = 1
    this.loadProducts(true)
  }

  loadProducts(clearResult: boolean) {
    this.productsService.all_backend({ page: this.page, s: this.s }).then(e => {
      if (e.success) {
        this.products = clearResult ? e.products! : [...this.products, ...e.products!]
        this.page = e.meta!.page
        this.showLoadMore = this.page < e.meta!.last_page
      }
      else console.log(e)
    })

  }

}