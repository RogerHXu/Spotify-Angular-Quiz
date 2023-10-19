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

  drop(event: CdkDragDrop<TrackData[]>): void {
    const draggedItemData = event.item.data;
    console.log(draggedItemData);

    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    console.log("Items in droppedArtistArray:", this.droppedArtistArray);
  }
}

// import { Component, OnInit, ViewChild } from "@angular/core";
// import { Subscription } from "rxjs";
// import { TrackData, TrackDataWithSelection } from "src/track.interface";
// import { Router } from "@angular/router";
// import { slice } from "lodash";
// import { DataService } from "src/track-data.service";
// import {
//   CdkDragDrop,
//   moveItemInArray,
//   transferArrayItem,
// } from "@angular/cdk/drag-drop";
// import { HomeComponent } from "../home/home.component";

// @Component({
//   selector: "app-quiz",
//   templateUrl: "./quiz.component.html",
//   styleUrls: ["./quiz.component.css"],
// })
// export class QuizComponent implements OnInit {
//   @ViewChild(HomeComponent)
//   homeComponent!: HomeComponent; // Inject HomeComponent
//   // Inject HomeComponent
//   trackData: TrackDataWithSelection | undefined;
//   arrayTrackData: TrackData[] = [];
//   arrayArtistData: TrackData[] = [];
//   droppedArtistArray: TrackData[] = [];
//   showModal: boolean = false;
//   isWinnerCard: boolean = false;
//   score: number = 0;
//   private trackDataSubscription: Subscription | undefined;

//   constructor(private dataService: DataService, private router: Router) {}

//   trackList: any;
//   artistList: any;
//   ngOnInit(): void {
//     this.trackDataSubscription = this.dataService.storedData$.subscribe(
//       (data) => {
//         this.trackData = data;
//         this.arrayTrackData = data.trackData.slice(
//           0,
//           this.trackData.selectedTracks
//         );
//         this.arrayArtistData = [...data.trackData];
//         console.log("The arra of data is:", this.arrayTrackData);
//         // this.arrayTruckData = data.trackData;
//         // console.log("Subscribed to Quiz Component", this.trackData);
//       }
//     );
//   }
//   toggleModal() {
//     this.showModal = !this.showModal;
//   }
//   onCloseModal() {
//     this.showModal = false;
//   }
//   checkWinner() {
//     if (this.droppedArtistArray.length === this.arrayTrackData.length) {
//       // Check if all items in droppedArtistArray exist in arrayTrackData
//       const isAllItemsExist = this.droppedArtistArray.every((artist) => {
//         return this.arrayTrackData.some(
//           (track) => track.trackId === artist.trackId
//         );
//       });

//       if (isAllItemsExist) {
//         this.score += 10;
//         this.toggleModal();
//         this.isWinnerCard = true;
//         console.log("You won! All items are in arrayTrackData.");
//       } else {
//         this.toggleModal();
//         this.isWinnerCard = false;
//         console.log("You lost! Not all items are in arrayTrackData.");
//       }
//     } else {
//       this.toggleModal();
//       this.isWinnerCard = false;
//       console.log("You lost! Number of items do not match.");
//     }
//   }

//   onPlayButtonClicked() {
//     console.log("Clicked from quiz Component");
//     this.router.navigate(["/"]);
//     // Call the letsPlay() function from your HomeComponent to get new data.
//   }
//   drop(event: CdkDragDrop<TrackData[]>): void {
//     // Get the dragged item's data
//     const draggedItemData = event.item.data;
//     console.log(draggedItemData);
//     // Determine whether the item was dropped into the tracks container or artists container
//     if (event.previousContainer !== event.container) {
//       // Item was dropped from artists to tracks
//       transferArrayItem(
//         event.previousContainer.data,
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex
//       );
//     } else {
//       // Item was reordered within the same container
//       moveItemInArray(
//         event.container.data,
//         event.previousIndex,
//         event.currentIndex
//       );
//     }
//     console.log("Items in droppedArtistArray:", this.droppedArtistArray);
//   }

// }
