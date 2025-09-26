import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopArtistsComponent } from './top-artists/top-artists.component';
import { TopTracksComponent } from './top-tracks/top-tracks.component';
import { RecentComponent } from './recent/recent.component';
import { PlaylistsComponent } from './playlists/playlists.component';
import { AuthGuard } from './core/services/auth.guard';


const routes: Routes = [
  {
    path: 'account',
    component: LoginComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: '',
    component: SidebarComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'top-artists', component: TopArtistsComponent },
      { path: 'top-tracks', component: TopTracksComponent },
      { path: 'recent', component: RecentComponent },
      { path: 'playlists', component: PlaylistsComponent }
    ]
  },
  { path: '**', redirectTo: 'account' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
