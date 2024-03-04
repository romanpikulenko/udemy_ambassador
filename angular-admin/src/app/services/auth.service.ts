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

    return await this.handleResponse(response);
  }

  async userAsync() {
    const request = structuredClone(this.request)
    request.method = 'GET'
    request.credentials = 'include';

    const response = await fetch(`${environment.api}/user/`, request)

    const handled = await this.handleResponse(response);
    handled.User = handled.responseAnswer as User

    return handled
  }

  async handleResponse(response: Response): Promise<AuthResponse> {
    if (response.ok)
      return { responseAnswer: await response.json(), success: true }
    return { responseAnswer: await response.json(), success: false }
  }
}
