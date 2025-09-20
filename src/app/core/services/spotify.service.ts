import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient) { }

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

  // Método para obtener el perfil del usuario actual
  getCurrentUser(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    const url = 'https://api.spotify.com/v1/me';
    return this.http.get(url, { headers });
  }

  // Método para obtener playlists del usuario (usar total para contar)
  getUserPlaylists(
    accessToken: string,
    limit: number = 20,
    offset: number = 0
  ): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    const url = `https://api.spotify.com/v1/me/playlists?limit=${limit}&offset=${offset}`;
    return this.http.get(url, { headers });
  }

  // Método para obtener la cantidad de artistas seguidos (following)
  getFollowingArtists(accessToken: string, limit: number = 1): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    // La respuesta incluye artists.total con el total seguido
    const url = `https://api.spotify.com/v1/me/following?type=artist&limit=${limit}`;
    return this.http.get(url, { headers });
  }

  getArtist(accessToken: string, artistId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    });
    const url = `https://api.spotify.com/v1/artists/${artistId}`;
    return this.http.get(url, { headers });
  }

  getTrack(accessToken: string, trackId: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${accessToken}` });
    const url = `https://api.spotify.com/v1/tracks/${trackId}`;
    return this.http.get(url, { headers });
  }
}
