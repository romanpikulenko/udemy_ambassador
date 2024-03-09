import { Component, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderService } from '../../services/orders.service';
import { Order } from '../../interfaces/order';
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatExpansionModule, CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = []

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.all().then(e => {
      if (e.success) this.orders = e.orders!
      else console.log(e)
    })
  }

}
