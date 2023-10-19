import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from "src/track-data.service";
import { TrackData, TrackDataWithSelection } from "../../../track.interface";
import { PlayerComponent } from '../player/player.component';


@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  trackData!: TrackData[];
  numOfSongs: number = 1;
  @ViewChild(PlayerComponent)
  private buttonPlay!: PlayerComponent;
  
  constructor(private dataService: DataService) { }
  ngOnInit(): void {
     
  }

  loadSong() {
    this.dataService.getStoredData().subscribe(data =>{
      console.log(data.trackData);  
      /*if( data.trackData[0].preview_url){
        let playerCard = new PlayerComponent( data.trackData[0].preview_url, data.trackData[0].trackName)
      }*/
    })
  }

  public triggerButtonPlay: 'start' | 'stop' = "start";
  onStartButtonPlay(){ console.log('onStart'); }
  onPauseButtonPlay(){ console.log('onPause'); }
  onDoneButtonPlay(){
    this.buttonPlay.play();
}

}
