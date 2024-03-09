import { Injectable } from '@angular/core';
import { ProductsResponse } from '../interfaces/products-response';
import axios, { AxiosResponse } from 'axios';
import { Product } from '../interfaces/product';
import { environment } from '../../environments/environment.development';
import { FetchModels } from './FetchProducts';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  endpoint = `${environment.api}/products/`;

  constructor() { }

  async all() {
    const response = await axios.get(this.endpoint, {
      withCredentials: true
    })

    const handled = await this.handleResponseAxios(response, FetchModels.Collection);

    return handled
  }

  async delete(id: number) {
    const url = new URL(id.toString(), this.endpoint)

    const response = await axios.delete(url.toString(), {
      withCredentials: true
    })

    const handled = await this.handleResponseAxios(response);

    return handled
  }

  async get(id: number) {
    const url = new URL(id.toString(), this.endpoint)

    const response = await axios.get(url.toString(), {
      withCredentials: true
    })

    const handled = await this.handleResponseAxios(response, FetchModels.One);

    return handled
  }

  async create(body: any) {
    const response = await axios.post(this.endpoint, body, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponseAxios(response, FetchModels.One);

    return handled
  }

  async update(id: number, body: any) {
    const url = new URL(id.toString(), this.endpoint)

    const response = await axios.put(url.toString(), body, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponseAxios(response, FetchModels.One);

    return handled
  }

  async handleResponseAxios(response: AxiosResponse, getProducts: FetchModels = FetchModels.No): Promise<ProductsResponse> {

    const result: ProductsResponse = {
      responseBody: response.data,
      success: response.status >= 200 && response.status < 300
    }

    if (result.success) {
      switch (getProducts) {
        case FetchModels.No:
          break;
        case FetchModels.Collection:
          result.products = result.responseBody as Product[]
          break;
        case FetchModels.One:
          const product = result.responseBody as Product
          result.products = [product]
          break;
        default:
          throw Error('Not supported')

      }
    }

    return result
  }
}

