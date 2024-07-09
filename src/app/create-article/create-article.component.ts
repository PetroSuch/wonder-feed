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
import { HttpClient } from "@angular/common/http";

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

  constructor(private http: HttpClient) {
    this.http
      // .get("http://2.58.65.29:3000/getArticlesLocal?offset=0")
      .get("http://2.58.65.29:4200/getArticlesLocal?offset=0")
      .subscribe((data) => {
        console.log(data);
      });
  }

  drop(event: CdkDragDrop<number[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
