import { Component, Input, OnInit } from "@angular/core";
import { TrackData } from "src/track.interface";

@Component({
  selector: "app-artist",
  templateUrl: "./artist.component.html",
  styleUrls: ["./artist.component.css"],
})
export class ArtistComponent implements OnInit {
  @Input() trackData: TrackData | undefined;
  constructor() {}

  ngOnInit(): void {}
}
