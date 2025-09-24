# Spotify JB7

Aplicación Angular que integra la API de Spotify para visualizar Top Tracks, Top Artists, Recent Plays, Playlists y detalles avanzados de tracks/playlists, con modales reutilizables y UI responsive.

## Características

- Autenticación OAuth2 (Implicit/Auth Code) contra Spotify
- Vistas: Profile, Top Tracks, Top Artists, Recently Played, Playlists
- Modal reutilizable de Track y de Artist
- Detalles de Playlist con scroll, paginado incremental y recomendaciones
- Audio features/análisis por track (con fallback al endpoint no deprecado)
- UI responsive con mejoras de UX (hover, focus-visible, scrollbars, mobile-first)

## Tech Stack

- Angular 15
- TypeScript, RxJS
- Spotify Web API
- CSS responsive

## Configuración local

1) Clonar repo
```bash
git clone https://github.com/jbarzallo97/spotify-jb7
cd spotify-jb7
```

2) Instalar dependencias
```bash
npm install
```

3) Variables de entorno

Configura `src/environments/environment.ts` y `environment.prod.ts` con tu `clientId`, `redirectUri` y scopes. Importante: el `clientId` NO debe ir hardcodeado en el código fuente; usa variables de entorno/archivos de entorno según tu flujo [[memory:8590230]].

Ejemplo mínimo:
```ts
export const environment = {
  production: false,
  spotifyClientId: 'TU_CLIENT_ID',
  spotifyRedirectUri: 'http://localhost:4200/callback',
  spotifyScopes: [
    'user-read-email',
    'user-read-private',
    'user-top-read',
    'user-read-recently-played',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read'
  ]
};
```

4) Desarrollo
```bash
npm start
# Abre http://localhost:4200
```

## Endpoints de Spotify usados

- `/me` (perfil), `/me/top/artists`, `/me/top/tracks`
- `/me/player/recently-played`
- `/me/playlists`, `/playlists/{id}`, `/playlists/{id}/tracks`
- `/recommendations`
- `/audio-features/{id}` y `/audio-analysis/{id}` (single-track); el batch de audio-features está deprecado

## Recomendaciones y Audio Features

- Recomendaciones: se limitan a 1–5 seeds válidos (tracks/artists/genres) y se filtran vacíos. Se puede pasar `market` opcional.
- Audio Features: se consulta por ID individual y se orquesta con `forkJoin`, `retryWhen` y `catchError` para robustez.

## Scripts útiles

```bash
npm start        # Dev server
npm run build    # Build prod
npm run lint     # Linter
```

## Despliegue

1) Build de producción
```bash
npm run build
```
2) Sirve el contenido de `dist/spotify-jb7` (o el nombre generado) en tu hosting preferido (Vercel, Netlify, Nginx, S3+CloudFront, etc.).
3) Configura en el Dashboard de Spotify la `Redirect URI` pública para Auth.

## Créditos

Hecho por [Johan Barzallo](https://github.com/jbarzallo97). Diseño e implementación frontend, integración Spotify API y UX.
