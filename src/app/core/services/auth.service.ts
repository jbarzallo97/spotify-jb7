import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private clientId = environment.spotifyClientId;
  private redirectUri = environment.spotifyRedirectUri;
  private scopes = environment.spotifyScopes;

  constructor(private router: Router) { }

  login() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${this.clientId}&response_type=token&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${encodeURIComponent(this.scopes)}&show_dialog=true`;
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
    const token = localStorage.getItem('spotify_access_token');
    if (!token) { return null; }
    if (this.isTokenExpired()) { return null; }
    return token;
  }

  logout() {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiration');
    localStorage.removeItem('lastRoute');
    this.router.navigate(['/account']);
  }
}
