import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent {
  constructor(private router: Router) { }

  ngOnInit(): void {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (accessToken && expiresIn) {
      localStorage.setItem('spotify_access_token', accessToken);
      const expirationTime = Date.now() + Number(expiresIn) * 1000;
      localStorage.setItem('spotify_token_expiration', expirationTime.toString());

      // Limpia el hash para evitar re-procesos al navegar atrás/adelante
      history.replaceState(null, '', window.location.pathname);

      const lastRoute = localStorage.getItem('lastRoute');
      const target = lastRoute && !lastRoute.startsWith('/callback') && !lastRoute.startsWith('/account') ? lastRoute : '/profile';
      this.router.navigateByUrl(target);
    } else {
      console.error('No access token found, redirecting to login.');
      this.router.navigate(['/account']);
    }
  }
}
