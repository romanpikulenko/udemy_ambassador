import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/user';
import { AuthResponse } from '../interfaces/service-responses/auth-response';
import axios, { AxiosResponse } from 'axios';
import { Emitters } from '../emitters/emitters';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  request: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  private _authenticatedUser?: User

  set authenticatedUser(user: User | undefined) {
    this._authenticatedUser = user
    Emitters.authEmitter.emit(user)
  }

  get authenticatedUser() {
    return this._authenticatedUser
  }

  constructor() { }

  async register(body: any) {
    const response = await axios.post(`${environment.api}/register/`, body, {
      validateStatus: () => true
    })

    const handled = this.handleResponse(response)

    return handled
  }

  
  async login(body: any) {
    const response = await axios.post(`${environment.api}/login/`, body, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponse(response);
    this.authenticatedUser = undefined

    return handled
  }

  async logout() {
    const response = await axios.post(`${environment.api}/logout/`, {}, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponse(response);
    this.authenticatedUser = undefined

    return handled
  }

  async user() {
    const response = await axios.get(`${environment.api}/user/`, {
      withCredentials: true
    })

    const handled = await this.handleResponse(response, true);

    return handled
  }

  async updateInfo(body: any) {
    const response = await axios.put(`${environment.api}/users/info/`, body, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponse(response, true);

    return handled
  }

  async updatePassword(body: any) {
    const response = await axios.put(`${environment.api}/users/password/`, body, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponse(response, true);

    return handled
  }

  async handleResponse(response: AxiosResponse, getUser = false): Promise<AuthResponse> {

    const result: AuthResponse = {
      responseBody: response.data,
      success: response.status >= 200 && response.status < 300
    }

    if (getUser && result.success) {
      result.user = result.responseBody as User
      this.authenticatedUser = result.user
    }

    return result
  }
}
