import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../interfaces/user';
import { AuthResponse } from '../interfaces/auth-response';

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

  constructor() { }

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
}
