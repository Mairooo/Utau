import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

type DirectusLoginResponse = {
  data: {
    access_token: string;
    refresh_token: string;
    expires: number;
  };
};

const DIRECTUS_URL = (globalThis as any).DIRECTUS_URL || 'http://localhost:8055';
const ACCESS_TOKEN_KEY = 'directus_access_token';
const REFRESH_TOKEN_KEY = 'directus_refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  async login(email: string, password: string): Promise<void> {
    const url = `${DIRECTUS_URL}/auth/login`;
    const response = await this.http
      .post<DirectusLoginResponse>(url, { email, password, mode: 'json' })
      .toPromise();

    const tokens = response?.data;
    if (!tokens?.access_token) throw new Error('Authentication failed');

    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token);
    if (tokens.refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token);
  }

  async logout(): Promise<void> {
    const token = this.accessToken;
    try {
      if (token) {
        await this.http
          .post(`${DIRECTUS_URL}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
          .toPromise();
      }
    } catch {
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    await this.router.navigate(['/login']);
  }
}


