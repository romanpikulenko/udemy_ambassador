import { Injectable } from '@angular/core';
import { ProductsResponse } from '../interfaces/products-response';
import axios, { AxiosResponse } from 'axios';
import { Product } from '../interfaces/product';
import { environment } from '../../environments/environment.development';
import { FetchModels } from './FetchProducts';
import { OrdersResponse } from '../interfaces/orders-response';
import { Order } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  endpoint = `${environment.api}/orders/`;

  constructor() { }

  async all() {
    const response = await axios.get(this.endpoint, {
      withCredentials: true
    })

    const handled = await this.handleResponseAxios(response, FetchModels.Collection);

    return handled
  }

  async handleResponseAxios(response: AxiosResponse, getProducts: FetchModels = FetchModels.No): Promise<OrdersResponse> {

    const result: OrdersResponse = {
      responseBody: response.data,
      success: response.status >= 200 && response.status < 300
    }

    if (result.success) {
      switch (getProducts) {
        case FetchModels.No:
          break;
        case FetchModels.Collection:
          result.orders = result.responseBody as Order[]
          break;
        case FetchModels.One:
          const order = result.responseBody as Order
          result.orders = [order]
          break;
        default:
          throw Error('Not supported')

      }
    }

    return result
  }
}
