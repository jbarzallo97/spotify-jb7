import { Component, HostListener, OnInit } from '@angular/core';
import { SpotifyService } from '../core/services/spotify.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css']
})
export class RecentComponent implements OnInit {
  isLoading = false;
  tracks: Array<{ id: string; title: string; artists: string; imageUrl: string; duration: string; previewUrl: string | null; playedAt: string }>= [];

  pageSize = 7;
  currentPage = 1;
  private readonly MOBILE_BREAKPOINT = 768;

  isModalOpen = false;
  isTrackLoading = false;
  selectedTrack: any = null;

  constructor(private spotifyService: SpotifyService, private authService: AuthService) {}

  ngOnInit(): void {
    this.updatePageSizeForViewport();
    this.loadRecentlyPlayed();
  }

  @HostListener('window:resize')
  onResize() {
    const prevSize = this.pageSize;
    this.updatePageSizeForViewport();
    if (prevSize !== this.pageSize) {
      this.currentPage = 1;
    }
  }

  private updatePageSizeForViewport() {
    this.pageSize = window.innerWidth <= this.MOBILE_BREAKPOINT ? 6 : 7;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.tracks.length / this.pageSize));
  }

  get paginatedTracks() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.tracks.slice(start, start + this.pageSize);
  }

  nextPage() { if (this.currentPage < this.totalPages) this.currentPage += 1; }
  prevPage() { if (this.currentPage > 1) this.currentPage -= 1; }

  openTrackModal(trackId: string) {
    const token = this.authService.getAccessToken();
    if (!token) return;
    this.isModalOpen = true;
    this.isTrackLoading = true;
    this.selectedTrack = null;

    this.spotifyService.getTrack(token, trackId).subscribe({
      next: (track) => { this.selectedTrack = track; this.isTrackLoading = false; },
      error: () => { this.isTrackLoading = false; }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedTrack = null;
  }

  private loadRecentlyPlayed(): void {
    const token = this.authService.getAccessToken();
    if (!token) return;
    this.isLoading = true;
    this.spotifyService.getRecentlyPlayed(token)
      .subscribe({
        next: (res: any) => {
          const items = res?.items || [];
          this.tracks = items.map((it: any) => {
            const t = it?.track ?? {};
            return {
              id: t?.id ?? '',
              title: t?.name ?? 'Unknown Track',
              artists: (t?.artists || []).map((a: any) => a?.name).join(', '),
              imageUrl: t?.album?.images?.[0]?.url ?? '',
              duration: this.formatDuration(t?.duration_ms ?? 0),
              previewUrl: t?.preview_url ?? null,
              playedAt: it?.played_at ?? ''
            };
          });
          this.currentPage = 1;
          this.isLoading = false;
        },
        error: () => { this.isLoading = false; }
      });
  }

  formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  formatPlayedAt(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString();
  }

  getArtistsList(artists: any[] | undefined | null): string {
    if (!artists || artists.length === 0) return '';
    return artists.map(a => a?.name).filter(Boolean).join(', ');
  }

  getAlbumReleaseDate(track: any): string {
    const d = track?.album?.release_date as string | undefined;
    if (!d) return '';
    return d;
  }

  copyLink(url: string | null | undefined) {
    if (!url) { return; }
    if ((navigator as any)?.clipboard?.writeText) {
      navigator.clipboard.writeText(url).catch(() => {});
    } else {
      const temp = document.createElement('textarea');
      temp.value = url;
      document.body.appendChild(temp);
      temp.select();
      try { document.execCommand('copy'); } catch {}
      document.body.removeChild(temp);
    }
  }
}
