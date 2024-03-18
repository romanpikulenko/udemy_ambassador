import { Injectable } from '@angular/core';
import { LinkResponse } from '../interfaces/service-responses/link-response';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Link } from '../interfaces/link';
import { environment } from '../../environments/environment.development';
import { FetchModels } from './FetchModels';
import { ServiceBaseResponse } from '../interfaces/service-responses/service-base-response';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor() { }

  async create(data: any) {
    const response = await axios.post(`${environment.api}/orders/`, data, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponse(response);

    return handled
  }

  async confirm(source: string) {
    const data = {
      source: source
    }
    console.log(data)
    const response = await axios.post(`${environment.api}/orders/confirm/`, data, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponse(response);

    return handled
  }

  async handleResponse(response: AxiosResponse): Promise<ServiceBaseResponse> {

    const result: ServiceBaseResponse = {
      responseBody: response.data,
      success: response.status >= 200 && response.status < 300
    }

    return result
  }

}
