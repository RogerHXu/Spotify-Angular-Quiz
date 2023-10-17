import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { DataService } from "src/track-data.service";
import {
  TrackData,
  TrackDataArray,
  TrackDataWithSelection,
} from "src/track.interface";

@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.css"],
})
export class QuizComponent implements OnInit {
  trackData: TrackDataWithSelection | undefined;
  private trackDataSubscription: Subscription | undefined;
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.trackDataSubscription = this.dataService.storedData$.subscribe(
      (data) => {
        this.trackData = data;
        console.log("Subscribed to Quiz Component", this.trackData);
      }
    );
  }
}
