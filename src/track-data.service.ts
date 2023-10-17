import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { TrackData, TrackDataWithSelection } from "./track.interface";

// Define a custom type or interface to represent the combined data

@Injectable({
  providedIn: "root",
})
export class DataService {
  private storedDataSubject = new BehaviorSubject<TrackDataWithSelection>({
    trackData: [],
    selectedTracks: 0,
  });

  storedData$: Observable<TrackDataWithSelection> =
    this.storedDataSubject.asObservable();

  setStoredData(trackDataArray: TrackData[], selectedTracks: number): void {
    // Perform any data processing or actions here
    console.log("Received data:", trackDataArray);
    console.log("Received number of Tracks:", selectedTracks);

    // Create an object that combines track data and selected tracks
    const dataWithSelection: TrackDataWithSelection = {
      trackData: trackDataArray,
      selectedTracks: selectedTracks,
    };

    this.storedDataSubject.next(dataWithSelection);
  }

  getStoredData(): Observable<TrackDataWithSelection> {
    return this.storedData$;
  }
}
