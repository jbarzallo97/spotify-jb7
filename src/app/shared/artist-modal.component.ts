import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { SpotifyService } from '../core/services/spotify.service';

@Component({
  selector: 'app-artist-modal',
  templateUrl: './artist-modal.component.html',
  styleUrls: ['artist-modal.component.css']
})
export class ArtistModalComponent {
  @Input() artistId: string | null = null;
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();

  isLoading = false;
  artist: any = null;

  constructor(private authService: AuthService, private spotifyService: SpotifyService) {}

  ngOnChanges() {
    if (this.isOpen && this.artistId) {
      this.loadArtist(this.artistId);
    }
  }

  close() {
    this.isOpen = false;
    this.artist = null;
    this.closed.emit();
  }

  private loadArtist(id: string) {
    const token = this.authService.getAccessToken();
    if (!token) return;
    this.isLoading = true;
    this.spotifyService.getArtist(token, id).subscribe({
      next: (a) => { this.artist = a; this.isLoading = false; },
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

  formatNumber(num: number | undefined | null): string {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  }
}
