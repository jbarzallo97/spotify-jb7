import { Component } from '@angular/core';
import { SpotifyService } from '../core/services/spotify.service';
import { AuthService } from '../core/services/auth.service';

interface UserProfile {
  name: string;
  pictureUrl: string;
  followers: number;
  following: number;
  playlists: number;
}

interface Artist {
  name: string;
  imageUrl: string;
}

interface Track {
  title: string;
  duration: string;
  imageUrl: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  followedArtists: any[] = [];
  selectedMenuItem: string = 'profile';  // Por defecto, selecciona "profile"

  profile: UserProfile = {
    name: 'Johan Barzallo',
    pictureUrl: 'assets/images/file.jpg',
    followers: 0,
    following: 12,
    playlists: 2
  };

  topArtists: Artist[] = [];
  topTracks: Track[] = [];

  selectMenuItem(menuItem: string) {
    this.selectedMenuItem = menuItem;
  }

  constructor(private spotifyService: SpotifyService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadTopArtists();
    this.loadTopTracks();
  }

  private loadTopArtists(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      return;
    }
    this.spotifyService.getTopArtists(token, 'long_term', 10, 0)
      .subscribe((res: any) => {
        this.topArtists = (res?.items || []).map((a: any) => ({
          name: a?.name ?? 'Unknown Artist',
          imageUrl: a?.images?.[0]?.url ?? ''
        }));
      });
  }

  private loadTopTracks(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      return;
    }
    this.spotifyService.getTopTracks(token, 'long_term', 10, 0)
      .subscribe((res: any) => {
        this.topTracks = (res?.items || []).map((t: any) => ({
          title: t?.name ?? 'Unknown Track',
          duration: this.formatDuration(t?.duration_ms ?? 0),
          imageUrl: t?.album?.images?.[0]?.url ?? ''
        }));
      });
  }

  private formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${paddedSeconds}`;
  }


  logout() {
    this.authService.logout();
  }
}
