import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { DataService } from "src/track-data.service";
import { TrackData, TrackDataWithSelection } from "src/track.interface";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";

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
  // drop(event: CdkDragDrop<TrackData[]>) {
  //   console.log(event);
  // }

  drop(event: CdkDragDrop<TrackDataWithSelection[]>): void {
    // Get the dragged item's data
    const draggedItemData = event.item.data;

    // Determine whether the item was dropped into the tracks container or artists container
    if (event.previousContainer !== event.container) {
      // Item was dropped from artists to tracks
      console.log("Dropped into tracks:", draggedItemData);
    } else {
      // Item was reordered within the same container
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
