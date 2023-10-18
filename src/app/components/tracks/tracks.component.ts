import { Component, Input, OnInit } from "@angular/core";
import { TrackData } from "src/track.interface";

@Component({
  selector: "app-tracks",
  templateUrl: "./tracks.component.html",
  styleUrls: ["./tracks.component.css"],
})
export class TracksComponent implements OnInit {
  @Input() trackData: TrackData | undefined;
  constructor() {}

  ngOnInit(): void {}
}
