import { Injectable } from '@angular/core';
import { LinkResponse } from '../interfaces/service-responses/link-response';
import axios, { AxiosResponse } from 'axios';
import { Link } from '../interfaces/link';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  constructor() { }

  async all(id: number) {
    const response = await axios.get(`${environment.api}/users/${id}/links`, {
      withCredentials: true
    })

    const handled = await this.handleResponseAxios(response, true);

    return handled
  }

  async handleResponseAxios(response: AxiosResponse, getUsers = false): Promise<LinkResponse> {

    const result: LinkResponse = {
      responseBody: response.data,
      success: response.status == 200
    }

    if (getUsers && result.success) {
      result.links = result.responseBody as Link[]
    }

    return result
  }

}
