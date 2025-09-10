import { Component } from '@angular/core';

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrls: ['./top-artists.component.css']
})
export class TopArtistsComponent {
  selectedPeriod = 'allTime';

  selectPeriod(period: string) {
    this.selectedPeriod = period;
  }
}
