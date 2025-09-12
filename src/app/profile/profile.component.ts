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
  profile: UserProfile = {
    name: '',
    pictureUrl: '',
    followers: 0,
    following: 0,
    playlists: 0
  };

  topArtists: Artist[] = [];
  topTracks: Track[] = [];

  constructor(private spotifyService: SpotifyService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadTopArtists();
    this.loadTopTracks();
    this.loadUserProfile();
    this.loadUserPlaylistsCount();
    this.loadUserFollowingCount();
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

  private loadUserProfile(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      return;
    }
    this.spotifyService.getCurrentUser(token)
      .subscribe((user: any) => {
        this.profile = {
          name: user?.display_name ?? this.profile.name,
          pictureUrl: user?.images?.[0]?.url ?? this.profile.pictureUrl,
          followers: user?.followers?.total ?? this.profile.followers,
          following: this.profile.following,
          playlists: this.profile.playlists
        };
      });
  }

  private loadUserPlaylistsCount(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      return;
    }
    // Pedimos 1 ítem: el response incluye 'total' con el total de playlists
    this.spotifyService.getUserPlaylists(token, 1, 0)
      .subscribe((res: any) => {
        const total = res?.total ?? (res?.items?.length ?? 0);
        this.profile = {
          ...this.profile,
          playlists: total
        };
      });
  }

  private loadUserFollowingCount(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      return;
    }
    this.spotifyService.getFollowingArtists(token, 1)
      .subscribe((res: any) => {
        const total = res?.artists?.total ?? 0;
        this.profile = {
          ...this.profile,
          following: total
        };
      });
  }


  logout() {
    this.authService.logout();
  }
}
