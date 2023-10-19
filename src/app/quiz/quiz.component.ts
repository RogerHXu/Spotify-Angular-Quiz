// quiz.component.ts
import { Component, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { TrackData, TrackDataWithSelection } from "src/track.interface";
import { Router } from "@angular/router";
import { DataService } from "src/track-data.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag
} from "@angular/cdk/drag-drop";
import { HomeComponent } from "../home/home.component";


@Component({
  selector: "app-quiz",
  templateUrl: "./quiz.component.html",
  styleUrls: ["./quiz.component.css"],
})
export class QuizComponent implements OnInit {
  @ViewChild(HomeComponent)
  homeComponent!: HomeComponent;

  trackData: TrackDataWithSelection | undefined;
  arrayTrackData: TrackData[] = [];
  arrayArtistData: TrackData[] = [];
  droppedArtistArray: TrackData[] = [];
  showModal: boolean = false;
  isWinnerCard: boolean = false;
  score: number = 0; // Initialize score

  private trackDataSubscription: Subscription | undefined;
  trackList: any;
  artistList: any;
  answerChecks: { [key: string]: boolean; }[] = [];

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    // Retrieve the score from local storage, or initialize to zero if it doesn't exist
    const storedScore = localStorage.getItem("score");
    if (storedScore) {
      this.score = parseInt(storedScore, 10);
    } else {
      this.score = 0;
      localStorage.setItem("score", this.score.toString());
    }

    this.trackDataSubscription = this.dataService.storedData$.subscribe(
      (data) => {
        // this.trackData = data;
        this.arrayTrackData = data.trackData;
        this.arrayArtistData = [...this.arrayTrackData];
        console.log("The arra of data is:", this.arrayTrackData);
        // this.arrayTruckData = data.trackData;
        // console.log("Subscribed to Quiz Component", this.trackData);
        this.trackData = data;
        this.arrayTrackData = data.trackData.slice(
          0,
          this.trackData.selectedTracks
        );
        this.arrayArtistData = [...data.trackData];
        console.log("The array of data is:", this.arrayTrackData);
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
      const isAllItemsExist = this.droppedArtistArray.every((artist) => {
        return this.arrayTrackData.some(
          (track) => track.trackId === artist.trackId
        );
      });

      if (isAllItemsExist) {
        this.score += 10;
        localStorage.setItem("score", this.score.toString()); // Save score to local storage
        this.toggleModal();
        this.isWinnerCard = true;
        console.log("You won! All items are in arrayTrackData.");
      } else {
        this.toggleModal();
        this.isWinnerCard = false;
        console.log("You lost! Not all items are in arrayTrackData.");
        // Set the score to 0 in local storage when not all items match
        this.score = 0;
        localStorage.setItem("score", "0");

        console.log("You lost! Number of items do not match.");
      }
    } else {
      this.toggleModal();
      this.isWinnerCard = false;
      // Set the score to 0 in local storage when not all items match
      this.score = 0;
      localStorage.setItem("score", "0");
      console.log("You lost! Number of items do not match.");
    }
  }

  onPlayButtonClicked() {
    console.log("Clicked from quiz Component");
    this.router.navigate(["/"]);
    // Save the score to local storage when the play button is clicked
    localStorage.setItem("score", this.score.toString());
  }

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

