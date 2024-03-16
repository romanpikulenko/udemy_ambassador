import { Injectable } from '@angular/core';
import { LinkResponse } from '../interfaces/service-responses/link-response';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Link } from '../interfaces/link';
import { environment } from '../../environments/environment.development';
import { FetchModels } from './FetchModels';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor() { }

  async get(code: string) {
    const response = await axios.get(`${environment.api}/checkout/${code}`, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponse(response, FetchModels.One);

    return handled
  }

  async handleResponse(response: AxiosResponse, getProducts: FetchModels = FetchModels.No): Promise<LinkResponse> {

    const result: LinkResponse = {
      responseBody: response.data,
      success: response.status >= 200 && response.status < 300
    }

    if (result.success) {
      switch (getProducts) {
        case FetchModels.No:
          break;
        case FetchModels.Collection:
          result.links = result.responseBody as Link[]
          break;
        case FetchModels.One:
          const link = result.responseBody as Link
          result.links = [link]
          break;
        default:
          throw Error('Not supported')
      }
    }

    return result
  }

}
