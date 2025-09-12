import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) { }

  // Método para buscar artistas en Spotify
  // getFollowedArtists(accessToken: string): Observable<any> {
  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${accessToken}`
  //   });

  //   // Petición a la API de Spotify para obtener los artistas seguidos
  //   return this.http.get('https://api.spotify.com/v1/me/following?type=artist', { headers });
  // }

  // Método para obtener los top artists del usuario según escuchas
  getTopArtists(
    accessToken: string,
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term',
    limit: number = 20,
    offset: number = 0
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    const url = `https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}&offset=${offset}`;
    return this.http.get(url, { headers });
  }

  // Método para obtener los top tracks del usuario según escuchas
  getTopTracks(
    accessToken: string,
    timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term',
    limit: number = 20,
    offset: number = 0
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });

    const url = `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}&offset=${offset}`;
    return this.http.get(url, { headers });
  }
}
