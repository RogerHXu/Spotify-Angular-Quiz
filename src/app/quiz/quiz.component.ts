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
  // trackData: TrackDataWithSelection | undefined;
  arrayTruckData: TrackData[] = [];
  arrayArtistData: TrackData[] = [];
  droppedArtistArray: TrackData[] = [];
  private trackDataSubscription: Subscription | undefined;
  constructor(private dataService: DataService) {}
  trackList: any;
  artistList: any;
  ngOnInit(): void {
    this.trackDataSubscription = this.dataService.storedData$.subscribe(
      (data) => {
        // this.trackData = data;
        this.arrayTruckData = data.trackData;
        this.arrayArtistData = [...this.arrayTruckData];
        console.log("The arra of data is:", this.arrayTruckData);
        // this.arrayTruckData = data.trackData;
        // console.log("Subscribed to Quiz Component", this.trackData);
      }
    );
  }
  drop(event: CdkDragDrop<TrackData[]>): void {
    // Get the dragged item's data
    const draggedItemData = event.item.data;
    console.log(draggedItemData);
    // Determine whether the item was dropped into the tracks container or artists container
    if (event.previousContainer !== event.container) {
      // Item was dropped from artists to tracks
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Item was reordered within the same container
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log("Items in droppedArtistArray:", this.droppedArtistArray);
  }

  //   drop(event: CdkDragDrop<TrackData[]>): void {
  //     // Get the dragged item's data
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //     console.log(event);
  //   }
}
