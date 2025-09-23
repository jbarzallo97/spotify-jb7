import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../core/services/spotify.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {
  isLoading = false;
  playlists: Array<{ id: string; name: string; imageUrl: string; tracksTotal: number; owner: string; public: boolean; href: string }>= [];

  constructor(private spotifyService: SpotifyService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  private loadPlaylists(): void {
    const token = this.authService.getAccessToken();
    if (!token) return;
    this.isLoading = true;
    // Traemos hasta 50 playlists (máximo por request). Si necesitas paginación del backend, luego iteramos offset.
    this.spotifyService.getUserPlaylists(token, 50, 0).subscribe({
      next: (res: any) => {
        const items = res?.items || [];
        this.playlists = items.map((p: any) => ({
          id: p?.id ?? '',
          name: p?.name ?? 'Unknown Playlist',
          imageUrl: p?.images?.[0]?.url ?? '',
          tracksTotal: p?.tracks?.total ?? 0,
          owner: p?.owner?.display_name ?? 'Unknown',
          public: !!p?.public,
          href: p?.external_urls?.spotify ?? ''
        }));
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }
}
