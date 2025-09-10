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

  topTracks: Track[] = [
    { title: 'El Señor Es Mi Rey', duration: '1:39', imageUrl: 'assets/images/file.jpg' },
    { title: 'Cristo No Está Muerto', duration: '1:27', imageUrl: 'assets/images/file.jpg' },
    { title: 'Llegó El Tiempo', duration: '2:54', imageUrl: 'assets/images/file.jpg' },
    { title: 'Agradecido', duration: '3:41', imageUrl: 'assets/images/file.jpg' }
  ];

  selectMenuItem(menuItem: string) {
    this.selectedMenuItem = menuItem;
  }

  constructor(private spotifyService: SpotifyService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadTopArtists();
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


  logout() {
    this.authService.logout();
  }
}
