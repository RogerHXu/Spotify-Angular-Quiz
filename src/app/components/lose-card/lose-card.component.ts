import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-lose-card",
  templateUrl: "./lose-card.component.html",
  styleUrls: ["./lose-card.component.css"],
})
export class LoseCardComponent implements OnInit {
  @Output() playButtonClicked = new EventEmitter<void>();

  onPlayButtonClick() {
    this.playButtonClicked.emit();
  }
  constructor() {}

  ngOnInit(): void {}
}
