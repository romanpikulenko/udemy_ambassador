import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../interfaces/product';

@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(products: Product[], sort?: string): Product[] {
    // if (sort === 'asc') return products.sort((a, b) => {
    //   if (a.price > b.price) return 1;
    //   if (a.price < b.price) return -1;
    //   return 0;
    // })
    // if (sort === 'desc') return products.sort((a, b) => {
    //   if (a.price > b.price) return -1;
    //   if (a.price < b.price) return 1;
    //   return 0;
    // })

    if (sort === 'asc') return products.sort((a, b) => a.price - b.price)
    if (sort === 'desc') return products.sort((a, b) => b.price - a.price)

    return products;
  }
}
