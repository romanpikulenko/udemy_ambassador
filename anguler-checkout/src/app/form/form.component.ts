import { Component, OnInit } from '@angular/core';
import { LinkService } from '../services/link.service';
import { ActivatedRoute } from '@angular/router';
import { Link } from '../interfaces/link';
import { CommonModule } from '@angular/common';
import { Product } from '../interfaces/product';
import { User } from '../interfaces/user';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { environment } from '../../environments/environment.development';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var Stripe: (stripe_key: string) => any

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent implements OnInit {
  code = ''
  link?: Link
  products: Product[] = []
  user?: User
  quantities: Record<number, number> = {}
  form!: FormGroup
  stripe: any

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private linkService: LinkService,
    private orderService: OrderService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      first_name: '',
      last_name: '',
      email: '',
      address: '',
      country: '',
      city: '',
      zip: ''
    })

    if (isPlatformBrowser(this.platformId)) {
      this.stripe = Stripe(`${environment.stripe_key}`)
    }

    console.log(this.stripe)

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

  total() {
    const sum = this.products.filter(e => e.id in this.quantities).reduce((s, p) => s + p.price * this.quantities[p.id], 0)

    return sum
  }

  submit() {
    const data = {
      code: this.code,
      ...this.form.getRawValue(),
      products: this.products.filter(e => e.id in this.quantities && this.quantities[e.id] > 0).map(p => ({
        product_id: p.id,
        quantity: this.quantities[p.id]
      }))
    }

    this.orderService.create(data).then(e => {
      console.log(e)
      if (e.success) {
        this.stripe.redirectToCheckout({
          sessionId: e.responseBody.id
        })
      }
    })
  }
}
