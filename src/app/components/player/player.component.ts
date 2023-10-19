import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Howl, Howler } from 'howler';
import { faPause, faPlay, faVolumeDown, faAmbulance} from '@fortawesome/free-solid-svg-icons';

import { TrackData } from 'src/track.interface';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  @Input()
  trackData!: TrackData;

  @Output() onStart = new EventEmitter<void>();
  @Output() onPause = new EventEmitter<void>();
  @Output() onEnd = new EventEmitter<void>();

  playBtnIcon = faPlay;
  faVolume = faVolumeDown;
  song: Howl;
  sourceUrl: string | null;
  title: string | null;

  public indicatorMode: 'pause' | 'play' | 'replay'= 'play';
  private playing: boolean = false;

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
    this.onPause.emit()
  }

  private finish(){
    this.playBtnIcon = faAmbulance
    this.indicatorMode = 'play'
    this.onEnd.emit()
  }

  public volume(val: number) {
    Howler.volume(val)
  }

}
