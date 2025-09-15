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
    const currentUrl = this.router.url;
    const lastRoute = localStorage.getItem('lastRoute');

    if (currentUrl === '/' || currentUrl === '') {
      this.router.navigateByUrl(lastRoute || '/profile');
    }

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        localStorage.setItem('lastRoute', e.urlAfterRedirects);
      });
  }
}
