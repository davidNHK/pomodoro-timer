import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  exchangeTokenFromCode(code: string) {
    return this.http
      .post<{
        accessToken: string;
        error: { code: string };
        refreshToken: string;
      }>(
        `${environment.apiUrl}/auth/token`,
        new URLSearchParams({
          code,
          grant_type: 'authorization_code',
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.#removeTokens();
          const body = error.error;
          if (body?.errors?.[0]?.code === 'ERR_EXCHANGE_CODE')
            return of(body as any);
          throw error;
        }),
        map(resp => {
          if (resp.errors) return resp;
          this.accessToken = resp.accessToken;
          this.refreshToken = resp.refreshToken;
          return resp;
        }),
      );
  }

  refreshAccessToken(refreshToken: string) {
    return this.http
      .post(
        `${environment.apiUrl}/auth/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.#removeTokens();
          const body = error.error;
          if (body?.errors?.[0]?.code === 'ERR_REFRESH_TOKEN')
            return of(body as any);
          throw error;
        }),
        map(resp => {
          if (resp.error) return resp;
          this.accessToken = resp.accessToken;
          this.refreshToken = resp.refreshToken;
          return resp;
        }),
      );
  }

  #removeTokens() {
    this.accessToken = null;
    this.refreshToken = null;
  }

  hasAccessToken() {
    return !!this.accessToken;
  }

  logout() {
    this.#removeTokens();
  }

  get accessToken() {
    return localStorage.getItem('accessToken');
  }

  set accessToken(token: string | null) {
    if (!token) localStorage.removeItem('accessToken');
    else localStorage.setItem('accessToken', token);
  }

  get refreshToken() {
    return localStorage.getItem('refreshToken');
  }

  set refreshToken(token: string | null) {
    if (!token) {
      localStorage.removeItem('refreshToken');
    } else localStorage.setItem('refreshToken', token);
  }
}
