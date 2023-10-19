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
  arrayTrackData: TrackData[] = [];
  arrayArtistData: TrackData[] = [];
  droppedArtistArray: TrackData[] = [];
  showModal: boolean = false;
  private trackDataSubscription: Subscription | undefined;
  constructor(private dataService: DataService) {}
  trackList: any;
  artistList: any;
  ngOnInit(): void {
    this.trackDataSubscription = this.dataService.storedData$.subscribe(
      (data) => {
        this.trackData = data;
        this.arrayTrackData = data.trackData.slice(
          0,
          this.trackData.selectedTracks
        );
        this.arrayArtistData = [...data.trackData];
        console.log("The arra of data is:", this.arrayTrackData);
        // this.arrayTruckData = data.trackData;
        // console.log("Subscribed to Quiz Component", this.trackData);
      }
    );
  }
  toggleModal() {
    this.showModal = !this.showModal;
  }
  onCloseModal() {
    this.showModal = false;
  }
  checkWinner() {
    if (this.droppedArtistArray.length === this.arrayTrackData.length) {
      // Check if all items in droppedArtistArray exist in arrayTrackData
      const isAllItemsExist = this.droppedArtistArray.every((artist) => {
        return this.arrayTrackData.some(
          (track) => track.trackId === artist.trackId
        );
      });

      if (isAllItemsExist) {
        this.toggleModal();
        console.log("You won! All items are in arrayTrackData.");
      } else {
        console.log("You lost! Not all items are in arrayTrackData.");
      }
    } else {
      console.log("You lost! Number of items do not match.");
    }
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
