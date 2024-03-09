import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/products.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Product } from '../../interfaces/product';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, RouterModule, MatButtonModule, MatButtonToggleModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, AfterViewInit {
  columns = ['id', 'image', 'title', 'description', 'price', 'actions']
  dataSource = new MatTableDataSource();
  products?: Product[]
  @ViewChild(MatPaginator) paginator!: MatPaginator

  constructor(private productsService: ProductService) { }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.productsService.all().then(e => {
      this.products = e.products
      if (e.success) this.dataSource.data = this.products!
      else console.log(e)
    })
  }

  delete(id: number) {
    if (confirm("Are you sure?")) {
      this.productsService.delete(id).then(e => {
        if (e.success) {
          console.log("deleted")
          const productToDeleteIndex = this.products!.findIndex(e => e.id === id)
          console.log(productToDeleteIndex)
          this.products!.splice(productToDeleteIndex, 1)
          this.dataSource._updateChangeSubscription()
        }
        if (!e.success) console.log(e)
      })
    }
  }
}
