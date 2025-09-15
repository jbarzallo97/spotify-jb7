import { Component, EventEmitter, Output } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  selectedMenuItem: string = 'profile';

  selectMenuItem(menuItem: string) {
    this.selectedMenuItem = menuItem;
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.syncSelectedFromUrl(this.router.url);
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.syncSelectedFromUrl(e.urlAfterRedirects));
  }

  private syncSelectedFromUrl(url: string) {
    if (url.includes('top-artists')) this.selectedMenuItem = 'top-artists';
    else if (url.includes('top-tracks')) this.selectedMenuItem = 'top-tracks';
    else if (url.includes('recent')) this.selectedMenuItem = 'recent';
    else if (url.includes('playlists')) this.selectedMenuItem = 'playlists';
    else this.selectedMenuItem = 'profile';
  }
}
