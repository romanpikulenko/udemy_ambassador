import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import axios, { AxiosResponse } from 'axios';
import { UsersResponse } from '../interfaces/users-response';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  endpoint = ''

  constructor() {
    this.endpoint = `${environment.api}/users/`
  }

  async all() {
    const response = await axios.get(`${environment.api}/ambassadors/`, {
      withCredentials: true
    })

    const handled = await this.handleResponseAxios(response, true);

    return handled
  }


  async handleResponseAxios(response: AxiosResponse, getUsers = false): Promise<UsersResponse> {

    const result: UsersResponse = {
      responseBody: response.data,
      success: response.status == 200
    }

    if (getUsers && result.success) {
      result.users = result.responseBody as User[]
    }

    return result
  }


}
