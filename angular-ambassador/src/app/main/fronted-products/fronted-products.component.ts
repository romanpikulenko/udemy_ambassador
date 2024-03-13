import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Product } from '../../interfaces/product';
import { ProductService } from '../../services/products.service';
import { LinkService } from '../../services/link.service';
import { PaginatePipe } from '../pipes/paginate.pipe';
import { CommonModule } from '@angular/common';
import { FilterPipe } from '../pipes/filter.pipe';
import { SortPipe } from '../pipes/sort.pipe';

@Component({
  selector: 'app-fronted-products',
  standalone: true,
  imports: [CommonModule, PaginatePipe, FilterPipe, SortPipe],
  templateUrl: './fronted-products.component.html',
  styleUrl: './fronted-products.component.css'
})
export class FrontedProductsComponent {
  products: Product[] = []
  page = 1
  showLoadMore = true
  sortOrder?: string
  searchString = ''
  selected = new Set<number>()
  link = ''
  error = false


  constructor(private productsService: ProductService, private linkService: LinkService) { }

  ngOnInit(): void {
    this.productsService.all_frontend().then(e => {
      if (e.success) this.products = e.products!
      else console.log(e)
    })
  }
  loadMore() {
    this.page++;
    //this.loadProducts(false);
  }
  search(s: string) {
    this.searchString = s
    //this.page = 1
    //this.loadProducts(true)
  }
  sort(sortOrder: string) {
    this.sortOrder = sortOrder
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
