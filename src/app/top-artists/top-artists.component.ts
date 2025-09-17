import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../core/services/spotify.service';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrls: ['./top-artists.component.css']
})
export class TopArtistsComponent implements OnInit {
  selectedPeriod: 'allTime' | 'last6Months' | 'last4Weeks' = 'allTime';
  artists: Array<{ id: string; name: string; imageUrl: string; spotifyUrl: string }> = [];
  isLoading = false;

  isModalOpen = false;
  isArtistLoading = false;
  selectedArtist: any = null;

  constructor(private spotifyService: SpotifyService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  selectPeriod(period: 'allTime' | 'last6Months' | 'last4Weeks') {
    this.selectedPeriod = period;
    this.loadArtists();
  }

  openArtistModal(artistId: string) {
    const token = this.authService.getAccessToken();
    if (!token) { return; }
    this.isModalOpen = true;
    this.isArtistLoading = true;
    this.selectedArtist = null;
    this.spotifyService.getArtist(token, artistId).subscribe({
      next: (artist) => {
        this.selectedArtist = artist;
        this.isArtistLoading = false;
      },
      error: () => {
        this.isArtistLoading = false;
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedArtist = null;
  }

  copyArtistLink(url: string) {
    if (!url) { return; }
    if (navigator?.clipboard?.writeText) {
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

  private loadArtists(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      return;
    }
    this.isLoading = true;
    const timeRange = this.mapPeriodToTimeRange(this.selectedPeriod);
    this.spotifyService.getTopArtists(token, timeRange, 50, 0)
      .subscribe((res: any) => {
        this.artists = (res?.items || []).map((a: any) => ({
          id: a?.id ?? '',
          name: a?.name ?? 'Unknown Artist',
          imageUrl: a?.images?.[0]?.url ?? '',
          spotifyUrl: a?.external_urls?.spotify ?? '#'
        }));
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
  }

  private mapPeriodToTimeRange(period: 'allTime' | 'last6Months' | 'last4Weeks'): 'long_term' | 'medium_term' | 'short_term' {
    switch (period) {
      case 'last6Months':
        return 'medium_term';
      case 'last4Weeks':
        return 'short_term';
      default:
        return 'long_term';
    }
  }
}
