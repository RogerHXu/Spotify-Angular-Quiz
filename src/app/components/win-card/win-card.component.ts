import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-win-card",
  templateUrl: "./win-card.component.html",
  styleUrls: ["./win-card.component.css"],
})
export class WinCardComponent implements OnInit {
  @Input() scoreValue: number = 0;

  @Output() playButtonClicked = new EventEmitter<void>();

  onPlayButtonClick() {
    this.playButtonClicked.emit();
  }
  constructor() {}

  ngOnInit(): void {}
}
