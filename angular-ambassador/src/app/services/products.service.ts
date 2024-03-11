import { Injectable } from '@angular/core';
import { ProductsResponse } from '../interfaces/service-responses/products-response';
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

