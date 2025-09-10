import { Component, EventEmitter, Output } from '@angular/core';
import { SpotifyService } from '../core/services/spotify.service';
import { AuthService } from '../core/services/auth.service';

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

  constructor() { }

  ngOnInit(): void {
  }

}
