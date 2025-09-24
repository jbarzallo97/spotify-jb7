import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { SpotifyService } from '../core/services/spotify.service';

@Component({
  selector: 'app-track-modal',
  templateUrl: './track-modal.component.html',
  styleUrls: ['track-modal.component.css']
})
export class TrackModalComponent {
  @Input() trackId: string | null = null;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  isLoading = false;
  track: any = null;

  constructor(private authService: AuthService, private spotifyService: SpotifyService) {}

  ngOnChanges() {
    if (this.isOpen && this.trackId) {
      this.loadTrack(this.trackId);
    }
  }

  close() {
    this.isOpen = false;
    this.track = null;
    this.closed.emit();
  }

  private loadTrack(id: string) {
    const token = this.authService.getAccessToken();
    if (!token) return;
    this.isLoading = true;
    this.spotifyService.getTrack(token, id).subscribe({
      next: (t) => { this.track = t; this.isLoading = false; },
      error: () => { this.isLoading = false; }
    });
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

  getArtistsList(artists: any[] | undefined | null): string {
    if (!artists || artists.length === 0) return '';
    return artists.map(a => a?.name).filter(Boolean).join(', ');
  }

  getAlbumReleaseDate(track: any): string {
    const d = track?.album?.release_date as string | undefined;
    if (!d) return '';
    return d;
  }
}
