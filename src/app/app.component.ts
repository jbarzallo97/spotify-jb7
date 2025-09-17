import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'spotify-jb7';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const path = window.location.pathname || '/';
    if (path === '/') {
      const lastRoute = localStorage.getItem('lastRoute');
      if (lastRoute && !lastRoute.startsWith('/callback') && !lastRoute.startsWith('/account')) {
        this.router.navigateByUrl(lastRoute);
      } else {
        // deja que el redirectTo: 'profile' del router haga su trabajo
      }
    }

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        const url = e.urlAfterRedirects || e.url;
        if (!url.startsWith('/callback') && !url.startsWith('/account')) {
          localStorage.setItem('lastRoute', url);
        }
      });
  }
}
