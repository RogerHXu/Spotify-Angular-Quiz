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
  CdkDrag,
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
  answerChecks: { [key: string]: boolean }[] = [];

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
        // this.arrayTruckData = data.trackData;
        // console.log("Subscribed to Quiz Component", this.trackData);
        this.trackData = data;
        this.arrayTrackData = data.trackData.slice(
          0,
          this.trackData.selectedTracks
        );
        this.arrayArtistData = [...data.trackData];
        this.arrayArtistData = this.shuffleArr(this.arrayArtistData)
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
    let results = this.answerChecks.map((r) => {
      return Object.values(r)[0];
    });
    let rightChoice = true;
    results.forEach((result) => {
      if (result === false) rightChoice = false;
    });

    if (rightChoice) {
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
    Howler.unload();
  } 

  onPlayButtonClicked() {
    console.log("Clicked from quiz Component");
    this.router.navigate(["/"]);
    // Save the score to local storage when the play button is clicked
    localStorage.setItem("score", this.score.toString());
  }

  drop(event: CdkDragDrop<TrackData[]>): void {
    if (event.previousContainer === event.container) {
      // This handles reordering within the same container.
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // This handles dropping into a different container.
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Remove the dropped artist from the source array.
      const droppedArtist = event.container.data[event.currentIndex];
      const index = this.arrayArtistData.indexOf(droppedArtist);
      if (index !== -1) {
        this.arrayArtistData.splice(index, 1);
      }
    }
  }


  getAnswerFromPlayer($event: { [key: string]: boolean }) {
    const i = this.answerChecks.findIndex(
      (_element) => Object.keys(_element)[0] === Object.keys($event)[0]
    );
    if (i === -1) {
      this.answerChecks = this.answerChecks.concat($event);
    } else {
      this.answerChecks[i] = $event;
    }
  }

  shuffleArr(array: any) {
    const newArr = array.slice();
    for (var i = newArr.length - 1; i > 0; i--) {
      var rand = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
    }
    return newArr
  }
}
