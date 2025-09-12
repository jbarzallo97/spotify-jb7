import { Component } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SpotifyService } from '../core/services/spotify.service';
import { AuthService } from '../core/services/auth.service';
import { UserProfile } from '../core/interface/user-profile.interface';
import { Artist } from '../core/interface/artist.interface';
import { Track } from '../core/interface/track.interface';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isLoading = true;
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
    this.loadAllData();
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

  private loadAllData(): void {
    const token = this.authService.getAccessToken();
    if (!token) {
      this.isLoading = false;
      return;
    }

    const topArtists$ = this.spotifyService.getTopArtists(token, 'long_term', 10, 0).pipe(
      map((res: any) => {
        this.topArtists = (res?.items || []).map((a: any) => ({
          name: a?.name ?? 'Unknown Artist',
          imageUrl: a?.images?.[0]?.url ?? ''
        }));
        return true;
      }),
      catchError(() => of(false))
    );

    const topTracks$ = this.spotifyService.getTopTracks(token, 'long_term', 10, 0).pipe(
      map((res: any) => {
        this.topTracks = (res?.items || []).map((t: any) => ({
          title: t?.name ?? 'Unknown Track',
          duration: this.formatDuration(t?.duration_ms ?? 0),
          imageUrl: t?.album?.images?.[0]?.url ?? ''
        }));
        return true;
      }),
      catchError(() => of(false))
    );

    const profile$ = this.spotifyService.getCurrentUser(token).pipe(
      map((user: any) => {
        this.profile = {
          name: user?.display_name ?? this.profile.name,
          pictureUrl: user?.images?.[0]?.url ?? this.profile.pictureUrl,
          followers: user?.followers?.total ?? this.profile.followers,
          following: this.profile.following,
          playlists: this.profile.playlists
        };
        return true;
      }),
      catchError(() => of(false))
    );

    const playlistsCount$ = this.spotifyService.getUserPlaylists(token, 1, 0).pipe(
      map((res: any) => {
        const total = res?.total ?? (res?.items?.length ?? 0);
        this.profile = { ...this.profile, playlists: total };
        return true;
      }),
      catchError(() => of(false))
    );

    const followingCount$ = this.spotifyService.getFollowingArtists(token, 1).pipe(
      map((res: any) => {
        const total = res?.artists?.total ?? 0;
        this.profile = { ...this.profile, following: total };
        return true;
      }),
      catchError(() => of(false))
    );

    forkJoin([topArtists$, topTracks$, profile$, playlistsCount$, followingCount$]).subscribe(() => {
      this.isLoading = false;
    });
  }


  logout() {
    this.authService.logout();
  }
}
