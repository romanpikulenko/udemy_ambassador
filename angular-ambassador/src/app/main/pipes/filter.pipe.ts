import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../../interfaces/product';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {

  transform(products: Product[], filter: string): Product[] {
    if (!filter) return products
    const fil = filter.toLocaleLowerCase()
    return products.filter(e => e.title.toLocaleLowerCase().includes(fil) || e.description.toLocaleLowerCase().includes(fil));
  }

}
