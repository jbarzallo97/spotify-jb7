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
  artists: Array<{ name: string; imageUrl: string }> = [];
  isLoading = false;

  constructor(private spotifyService: SpotifyService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadArtists();
  }

  selectPeriod(period: 'allTime' | 'last6Months' | 'last4Weeks') {
    this.selectedPeriod = period;
    this.loadArtists();
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
          name: a?.name ?? 'Unknown Artist',
          imageUrl: a?.images?.[0]?.url ?? ''
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
