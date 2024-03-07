import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/user';
import { AuthResponse } from '../interfaces/auth-response';
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

  user?: User

  constructor() { }

  async registerAxios(body: any) {
    const response = await axios.post(`${environment.api}/register/`, body, {
      validateStatus: () => true
    })

    const handled = this.handleResponseAxios(response)

    return handled
  }

  async loginAxios(body: any) {
    const response = await axios.post(`${environment.api}/login/`, body, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponseAxios(response, true);

    return handled
  }

  async userAxios() {
    const response = await axios.get(`${environment.api}/user/`, {
      withCredentials: true
    })

    const handled = await this.handleResponseAxios(response, true);

    return handled
  }

  async updateInfo(body: any) {
    const response = await axios.put(`${environment.api}/users/info/`, body, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponseAxios(response, true);

    return handled
  }

  async updatePassword(body: any) {
    const response = await axios.put(`${environment.api}/users/password/`, body, {
      withCredentials: true,
      validateStatus: () => true
    })

    const handled = await this.handleResponseAxios(response, true);

    return handled
  }

  async registerAsync(body: any) {
    const request = structuredClone(this.request)
    request.body = JSON.stringify(body)

    const response = await fetch(`${environment.api}/register/`, request);

    return await this.handleResponse(response);
  }

  async loginAsync(body: any) {
    const request = structuredClone(this.request)
    request.body = JSON.stringify(body)
    request.credentials = 'include';

    const response = await fetch(`${environment.api}/login/`, request);
    const handled = await this.handleResponse(response, true);

    return handled
  }

  async userAsync() {
    const request = structuredClone(this.request)
    request.method = 'GET'
    request.credentials = 'include';

    const response = await fetch(`${environment.api}/user/`, request)
    const handled = await this.handleResponse(response, true);

    return handled
  }

  async logoutAsync() {
    const request = structuredClone(this.request)
    request.method = 'POST'
    request.credentials = 'include';

    const response = await fetch(`${environment.api}/logout/`, request)

    const handled = await this.handleResponse(response);

    if (handled.success) {
      this.updateUser(undefined)
    }

    return handled
  }

  async handleResponse(response: Response, getUser = false): Promise<AuthResponse> {

    const result: AuthResponse = {
      responseBody: await response.json(),
      success: response.ok
    }

    if (getUser && response.ok) {
      result.user = result.responseBody as User
    }

    return result
  }
  async handleResponseAxios(response: AxiosResponse, getUser = false): Promise<AuthResponse> {

    const result: AuthResponse = {
      responseBody: response.data,
      success: response.status == 200
    }

    if (getUser && result.success) {
      result.user = result.responseBody as User
      this.updateUser(result.user)
    }

    return result
  }

  updateUser(user?: User) {
    this.user = user
    Emitters.authEmitter.emit(user)
  }
}
