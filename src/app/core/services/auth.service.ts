import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private clientId = '35c9a4b3c9db45268c463448bbd6fd25';
  private redirectUri = 'http://localhost:4200/callback';
  private scopes = 'user-read-private user-read-email user-follow-read user-top-read';

  constructor() { }

  login() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=token&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(this.scopes)}`;
    window.location.href = authUrl;
  }

  isTokenExpired(): boolean {
    const expiration = localStorage.getItem('spotify_token_expiration');
    if (!expiration) {
      return true;  // Si no hay expiración guardada, consideramos el token como expirado
    }

    const now = Date.now();
    return now > Number(expiration);  // Verificar si el tiempo actual es mayor que el tiempo de expiración
  }

  getAccessToken(): string | null {
    if (!this.isTokenExpired()) {
      return localStorage.getItem('spotify_access_token');
    } else {
      this.login();  // Si el token ha expirado, redirigir para hacer login nuevamente
      return null;
    }
  }
  logout() {
    // Limpiar el token y redirigir al login
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiration');
    this.login();  // Redirigir al login para iniciar sesión nuevamente
  }
}
