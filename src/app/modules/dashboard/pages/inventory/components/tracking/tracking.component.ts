import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit {

  public lat = 51.678418;
  public lng = 7.809007;

  constructor() { }

  ngOnInit() {
  }

}
