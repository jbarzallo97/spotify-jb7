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

  // Modal de playlist
  isModalOpen = false;
  isPlaylistLoading = false;
  selectedPlaylist: any = null;
  selectedTracks: Array<{ id: string; title: string; artists: string; imageUrl: string; duration: string }>= [];
  private nextOffset: number = 0;
  private pageSize: number = 100;
  hasMoreTracks: boolean = false;

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

  openPlaylist(playlistId: string) {
    const token = this.authService.getAccessToken();
    if (!token) return;
    this.isModalOpen = true;
    this.isPlaylistLoading = true;
    this.selectedPlaylist = null;
    this.selectedTracks = [];
    this.nextOffset = 0;
    this.hasMoreTracks = false;

    this.spotifyService.getPlaylist(token, playlistId).subscribe({
      next: (pl) => {
        this.selectedPlaylist = pl;
      },
      error: () => {}
    });

    this.loadMoreTracks(playlistId);
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedPlaylist = null;
    this.selectedTracks = [];
  }

  private formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  loadMoreTracks(playlistId: string) {
    const token = this.authService.getAccessToken();
    if (!token) return;
    this.isPlaylistLoading = true;
    const currentOffset = this.nextOffset;
    this.spotifyService.getPlaylistTracks(token, playlistId, this.pageSize, currentOffset).subscribe({
      next: (res: any) => {
        const items = res?.items || [];
        const mapped = items
          .map((it: any) => it?.track)
          .filter(Boolean)
          .map((t: any) => ({
            id: t?.id ?? '',
            title: t?.name ?? 'Unknown Track',
            artists: (t?.artists || []).map((a: any) => a?.name).join(', '),
            imageUrl: t?.album?.images?.[0]?.url ?? '',
            duration: this.formatDuration(t?.duration_ms ?? 0)
          }));
        this.selectedTracks = [...this.selectedTracks, ...mapped];
        this.nextOffset = currentOffset + this.pageSize;
        const total = res?.total ?? this.selectedTracks.length;
        this.hasMoreTracks = this.selectedTracks.length < total;
        this.isPlaylistLoading = false;
      },
      error: () => { this.isPlaylistLoading = false; }
    });
  }
}
