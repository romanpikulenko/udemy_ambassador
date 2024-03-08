import { Injectable } from '@angular/core';
import { ProductsResponse } from '../interfaces/products-response';
import axios, { AxiosResponse } from 'axios';
import { Product } from '../interfaces/product';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor() { }

  async all() {
    const response = await axios.get(`${environment.api}/products/`, {
      withCredentials: true
    })

    const handled = await this.handleResponseAxios(response, true);

    return handled
  }

  async handleResponseAxios(response: AxiosResponse, getUsers = false): Promise<ProductsResponse> {

    const result: ProductsResponse = {
      responseBody: response.data,
      success: response.status == 200
    }

    if (getUsers && result.success) {
      result.products = result.responseBody as Product[]
    }

    return result
  }

}
