import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { LinkService } from '../../services/link.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-backend-products',
  standalone: true,
  imports: [CommonModule, ImageModule],
  templateUrl: './backend-products.component.html',
  styleUrl: './backend-products.component.css'
})
export class BackendProductsComponent implements OnInit {
  products: Product[] = []
  page = 1
  showLoadMore = false
  sortOrder?: string
  searchString?: string
  selected = new Set<number>()
  link = ''
  error = false


  constructor(private productsService: ProductService, private linkService: LinkService) { }

  ngOnInit(): void {
    this.loadProducts(false);
  }
  loadMore() {
    this.page++;
    this.loadProducts(false);
  }
  search(s: string) {
    this.searchString = s
    this.page = 1
    this.loadProducts(true)
  }
  sort(sortOrder: string) {
    if (sortOrder == this.sortOrder) return;

    this.sortOrder = sortOrder
    this.page = 1
    this.loadProducts(true)
  }

  loadProducts(clearResult: boolean) {
    this.productsService.all_backend({ page: this.page, search: this.searchString, sort: this.sortOrder }).then(e => {
      if (e.success) {
        this.products = clearResult ? e.products! : [...this.products, ...e.products!]
        this.page = e.meta!.page
        this.showLoadMore = this.page < e.meta!.last_page
      }
      else console.log(e)
    })
  }
  select(productId: number) {
    if (this.selected.has(productId)) this.selected.delete(productId)
    else this.selected.add(productId)
  }
  isSelected(productId: number) {
    return this.selected.has(productId)
  }
  generate() {
    const productIds = [...this.selected]
    this.linkService.generate(productIds).then(e => {
      this.error = !e.success
      if (e.success) this.link = `${environment.checkout_basepath}/${e.links![0].code}`
      else console.log(e)
    })
  }

}
