import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import axios, { AxiosResponse } from 'axios';
import { FetchModels } from './FetchProducts';
import { StatResponse } from '../interfaces/service-responses/stat-response';
import { Stat } from '../interfaces/stat';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  endpoint = `${environment.api}/stats/`;

  constructor() { }

  async all() {
    const response = await axios.get(this.endpoint, {
      withCredentials: true
    })

    const handled = await this.handleResponse(response, FetchModels.Collection);

    return handled
  }

  async handleResponse(response: AxiosResponse, getStats: FetchModels = FetchModels.No): Promise<StatResponse> {

    const result: StatResponse = {
      responseBody: response.data,
      success: response.status >= 200 && response.status < 300
    }

    if (result.success) {
      switch (getStats) {
        case FetchModels.No:
          break;
        case FetchModels.Collection:
          result.stats = result.responseBody as Stat[]
          break;
        case FetchModels.One:
          const stat = result.responseBody as Stat
          result.stats = [stat]
          break;
        default:
          throw Error('Not supported')

      }
    }

    return result
  }

}
