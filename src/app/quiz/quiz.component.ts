import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { DataService } from "src/track-data.service";
import { TrackData, TrackDataWithSelection } from "src/track.interface";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag
} from "@angular/cdk/drag-drop";


@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.css"],
})
export class QuizComponent implements OnInit {
  // trackData: TrackDataWithSelection | undefined;
  arrayTrackData: TrackData[] = [];
  arrayArtistData: TrackData[] = [];
  droppedArtistArray: TrackData[] = [];
  private trackDataSubscription: Subscription | undefined;
  constructor(private dataService: DataService) {}
  trackList: any;
  artistList: any;

  answerChecks: { [key: string]: boolean; }[] = [];


  ngOnInit(): void {
    this.trackDataSubscription = this.dataService.storedData$.subscribe(
      (data) => {
        // this.trackData = data;
        this.arrayTrackData = data.trackData;
        this.arrayArtistData = [...this.arrayTrackData];
        console.log("The arra of data is:", this.arrayTrackData);
        // this.arrayTruckData = data.trackData;
        // console.log("Subscribed to Quiz Component", this.trackData);
      }
    );
  }

  /*drop(event: CdkDragDrop<TrackData[]>): void {
    // Get the dragged item's data
    const draggedItemData = event.item.data;
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
  }*/
  drop(event: CdkDragDrop<TrackData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      this.droppedArtistArray = [event.item.data];
    }
  }

  getAnswerFromPlayer($event: { [key: string]: boolean; }){
    const i = this.answerChecks.findIndex(_element => Object.keys(_element)[0] === Object.keys($event)[0])   
    if(i === -1){
      this.answerChecks = this.answerChecks.concat($event);
    } 
    else {
      this.answerChecks[i] = $event
    }
  }
  
}
