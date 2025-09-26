// import { Component } from '@angular/core';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-callback',
//   templateUrl: './callback.component.html',
//   styleUrls: ['./callback.component.css']
// })
// export class CallbackComponent {
//   constructor(private router: Router) { }

//   ngOnInit(): void {
//     const fragment = window.location.hash.substring(1);
//     const params = new URLSearchParams(fragment);
//     const accessToken = params.get('access_token');
//     const expiresIn = params.get('expires_in');

//     if (accessToken && expiresIn) {
//       localStorage.setItem('spotify_access_token', accessToken);
//       const expirationTime = Date.now() + Number(expiresIn) * 1000;
//       localStorage.setItem('spotify_token_expiration', expirationTime.toString());

//       // Limpia el hash para evitar re-procesos al navegar atrás/adelante
//       history.replaceState(null, '', window.location.pathname);

//       const lastRoute = localStorage.getItem('lastRoute');
//       const target = lastRoute && !lastRoute.startsWith('/callback') && !lastRoute.startsWith('/account') ? lastRoute : '/profile';
//       this.router.navigateByUrl(target);
//     } else {
//       console.error('No access token found, redirecting to login.');
//       this.router.navigate(['/account']);
//     }
//   }
// }

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  template: `<p>Procesando autenticación…</p>`
})
export class CallbackComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // 1) Lee fragmento (implicit grant) o query (authorization code, por si acaso)
    const raw = window.location.hash?.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.search?.startsWith('?')
        ? window.location.search.substring(1)
        : '';

    const params = new URLSearchParams(raw);
    const accessToken = params.get('access_token');
    const expiresIn   = params.get('expires_in');

    if (accessToken && expiresIn) {
      // 2) Guarda token y vencimiento
      localStorage.setItem('spotify_access_token', accessToken);
      const expirationTime = Date.now() + Number(expiresIn) * 1000;
      localStorage.setItem('spotify_token_expiration', String(expirationTime));

      // 3) Calcula la raíz de la app desde <base href="...">
      //    En GH Pages (project site) esto te queda como "/spotify-jb7/"
      const appRootPath = new URL(document.baseURI).pathname; // robusto con base href="./" o "/repo/"

      // 4) Decide ruta de aterrizaje
      const lastRoute = localStorage.getItem('lastRoute');
      const target = (lastRoute && !lastRoute.startsWith('/callback') && !lastRoute.startsWith('/account'))
        ? lastRoute
        : '/profile';

      // 5) Limpia la URL (quitar /callback y el hash/query) ANTES de navegar
      //    Usa la raíz + target para que no quede "colgado" en /callback
      const cleanUrl = appRootPath + (target.startsWith('/') ? target.slice(1) : target);
      history.replaceState(null, '', cleanUrl);

      // 6) Navega dentro de Angular (el base href se respeta)
      this.router.navigateByUrl(target);
      return;
    }

    console.error('No access token found, redirecting to login.');
    this.router.navigate(['/account']);
  }
}

