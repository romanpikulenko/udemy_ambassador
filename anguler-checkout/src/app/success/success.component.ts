import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent implements OnInit {
  constructor(private orderService: OrderService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const source = this.route.snapshot.queryParams['source']

    this.orderService.confirm(source).then(e => {
      if (e.success) { }
      else console.log(e)
    })
  }
}
