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
    // Extraer el fragmento de la URL donde está el access token
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');

    if (accessToken && expiresIn) {
      // Almacenar el access token
      localStorage.setItem('spotify_access_token', accessToken);

      // Calcular el tiempo de expiración y almacenarlo
      const expirationTime = Date.now() + Number(expiresIn) * 1000;  // Tiempo en milisegundos
      localStorage.setItem('spotify_token_expiration', expirationTime.toString());

      // Redirigir a la página principal u otra ruta
      this.router.navigate(['/']);  // Redirigir a la página que desees (como un componente de perfil)
    } else {
      console.error('No access token found, redirecting to login.');
      // Si no se encuentra el token, redirigir al login
      this.router.navigate(['/']);
    }
  }
}
