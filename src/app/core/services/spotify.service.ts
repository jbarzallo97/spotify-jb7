import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) { }

  // Método para buscar artistas en Spotify
  getFollowedArtists(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    // Petición a la API de Spotify para obtener los artistas seguidos
    return this.http.get('https://api.spotify.com/v1/me/following?type=artist', { headers });
  }
}
