import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../../interfaces/product';


@Component({
  selector: 'app-products-form',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products-form.component.html',
  styleUrl: './products-form.component.css'
})
export class ProductsFormComponent implements OnInit {
  form!: FormGroup
  create!: boolean
  product?: Product


  constructor(private formBuilder: FormBuilder, private productsService: ProductService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      title: '',
      description: '',
      image: '',
      price: 0
    })
    this.create = this.activatedRoute.snapshot.data['create']!

    if (!this.create) {
      const productId = this.activatedRoute.snapshot.params["id"]

      this.productsService.get(productId!).then(e => {
        this.product = e.products![0]
        this.form.patchValue(this.product)
      })
    }
  }

  submit() {
    if (this.create)
      this.productsService.create(this.form.getRawValue()).then(e => {
        if (e.success) this.router.navigate(['/products'])
        else console.log(e)
      })
    else
      this.productsService.update(this.product!.id, this.form.getRawValue()).then(e => {
        if (e.success) this.router.navigate(['/products'])
        else console.log(e)
      })
  }
}
