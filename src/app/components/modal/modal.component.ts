import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
})
export class ModalComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  onCloseModal() {
    this.closeModal.emit();
  }

  constructor() {}

  ngOnInit(): void {}
}
