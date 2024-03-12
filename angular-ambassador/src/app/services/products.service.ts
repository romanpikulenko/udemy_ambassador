import { Injectable } from '@angular/core';
import { BackendProductsResponse, ProductsResponse } from '../interfaces/service-responses/products-response';
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios';
import { Product } from '../interfaces/product';
import { environment } from '../../environments/environment.development';
import { FetchModels } from './FetchProducts';
import { PaginationInfo } from '../interfaces/service-responses/pagination-info';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  endpoint = `${environment.api}/products/`;

  constructor() { }

  async all_backend(filter?: { page?: number, s?: string }) {

    const conf: AxiosRequestConfig = {
      withCredentials: true,
      validateStatus: () => true,
      params: {}
    }

    if (filter?.page) {
      conf.params.page = filter.page
    }
    if (filter?.s) {
      conf.params.s = filter.s
    }

    const response = await axios.get(`${this.endpoint}backend`, conf)

    const handled = await this.handleResponse(response, FetchModels.Collection);

    return handled
  }

  async all_frontend() {
    const response = await axios.get(`${this.endpoint}frontend/`, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponse(response, FetchModels.Collection);

    return handled
  }

  async handleResponse(response: AxiosResponse, getProducts: FetchModels = FetchModels.No): Promise<BackendProductsResponse> {

    const result: BackendProductsResponse = {
      responseBody: response.data,
      success: response.status >= 200 && response.status < 300
    }

    if (result.success) {
      if ('meta' in result.responseBody) {
        result.meta = result.responseBody['meta'] as PaginationInfo
      }
      const data = 'data' in result.responseBody ? result.responseBody['data'] : result.responseBody

      switch (getProducts) {
        case FetchModels.No:
          break;
        case FetchModels.Collection:
          result.products = data as Product[]
          break;
        case FetchModels.One:
          const product = data as Product
          result.products = [product]
          break;
        default:
          throw Error('Not supported')
      }
    }

    return result
  }
}

