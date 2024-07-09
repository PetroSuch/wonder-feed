import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
  NgbAccordionModule,
  NgbDropdownModule,
} from "@ng-bootstrap/ng-bootstrap";
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-create-template",
  standalone: true,
  imports: [CommonModule, NgbAccordionModule, NgbDropdownModule],
  templateUrl: "./create-template.component.html",
  styleUrl: "./create-template.component.scss",
})
export class CreateTemplateComponent {
  public items = ["Product Title 1", "Product Title 2", "Product Title 3"];

  drop(event: CdkDragDrop<number[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
