import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Howl, Howler } from 'howler';
import { faPause, faPlay, faVolumeHigh, faRotateLeft} from '@fortawesome/free-solid-svg-icons';

import { TrackData } from 'src/track.interface';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag
} from "@angular/cdk/drag-drop";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input()
  trackData!: TrackData;

  droppedArtistArray = <TrackData[]>[]
  playBtnIcon = faPlay;
  faVolume = faVolumeHigh;
  song: Howl;
  sourceUrl: string | null;
  title: string | null;

  public indicatorMode: 'pause' | 'play' | 'replay'= 'play';

  @Output()
  callQuiz = new EventEmitter();

  answer!: { [key: string]: boolean; };

  constructor() {
    this.song = null as any,
    this.sourceUrl = "";
    this.title = "";
  }

  ngOnInit(): void {
    this.song = null as any,
    this.sourceUrl = (this.trackData != undefined) ? this.trackData.preview_url : "";
    this.title = (this.trackData != undefined) ? this.trackData.trackName : "";
  }

  public toggleState(){
    switch(this.indicatorMode){
      case 'pause':{
        this.pause();
        break;
      }
      case 'play':{
        this.play();
        break;
      }
      case 'replay':{
        this.finish();
        break;
      }
    }
  }

  public play() {
    if (!this.song && this.sourceUrl != null) {
      this.song = new Howl({      
        src: [this.sourceUrl],
        format: ['mp3'],
        autoplay: false,
        volume: 0.5,
        onend: () => {
          this.finish()
        }
      })
    }
    this.indicatorMode = 'pause'
    this.playBtnIcon = faPause
    this.song.play();
  }

  public pause() {
    this.indicatorMode = 'play'
    this.playBtnIcon = faPlay
    this.song.pause();
  }

  private finish(){
    this.playBtnIcon = faRotateLeft
    this.indicatorMode = 'play'
  }

  public volume(val: number) {
    Howler.volume(val)
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
    
    let id = this.trackData.trackId 
    if(this.droppedArtistArray[0].trackId != this.trackData.trackId){ 
      this.answer = {[id]: false }
    }else{
      this.answer = {[id]: true }
    }
    this.callQuiz.emit(this.answer);
  }

}
