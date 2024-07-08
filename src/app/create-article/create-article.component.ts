import { Component } from "@angular/core";
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
  transferArrayItem,
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-create-article",
  standalone: true,
  imports: [
    NgbAccordionModule,
    NgbDropdownModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: "./create-article.component.html",
  styleUrl: "./create-article.component.scss",
})
export class CreateArticleComponent {
  public items = ["Product Title 1", "Product Title 2", "Product Title 3"];

  drop(event: CdkDragDrop<number[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
