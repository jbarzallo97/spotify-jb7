import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../core/services/spotify.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-top-tracks',
  templateUrl: './top-tracks.component.html',
  styleUrls: ['./top-tracks.component.css']
})
export class TopTracksComponent implements OnInit {
  selectedPeriod: 'allTime' | 'last6Months' | 'last4Weeks' = 'allTime';
  isLoading = false;
  tracks: Array<{ id: string; title: string; artists: string; imageUrl: string; duration: string; previewUrl: string | null }>= [];

  // Paginación (cliente)
  pageSize = 7;
  currentPage = 1;

  constructor(private spotifyService: SpotifyService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTracks();
  }

  selectPeriod(period: 'allTime' | 'last6Months' | 'last4Weeks') {
    this.selectedPeriod = period;
    this.currentPage = 1;
    this.loadTracks();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.tracks.length / this.pageSize));
  }

  get paginatedTracks() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.tracks.slice(start, start + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage += 1;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage -= 1;
  }

  private loadTracks(): void {
    const token = this.authService.getAccessToken();
    if (!token) return;
    this.isLoading = true;
    const timeRange = this.mapPeriodToTimeRange(this.selectedPeriod);
    this.spotifyService.getTopTracks(token, timeRange, 50, 0)
      .subscribe({
        next: (res: any) => {
          this.tracks = (res?.items || []).map((t: any) => ({
            id: t?.id ?? '',
            title: t?.name ?? 'Unknown Track',
            artists: (t?.artists || []).map((a: any) => a?.name).join(', '),
            imageUrl: t?.album?.images?.[0]?.url ?? '',
            duration: this.formatDuration(t?.duration_ms ?? 0),
            previewUrl: t?.preview_url ?? null
          }));
          this.currentPage = 1;
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
  }

  private formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private mapPeriodToTimeRange(period: 'allTime' | 'last6Months' | 'last4Weeks'): 'long_term' | 'medium_term' | 'short_term' {
    switch (period) {
      case 'last6Months': return 'medium_term';
      case 'last4Weeks': return 'short_term';
      default: return 'long_term';
    }
  }
}
