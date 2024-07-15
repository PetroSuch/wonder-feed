import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CategoryService } from "../../services/category.service";
import { catchError, finalize, Observable, tap } from "rxjs";
import { AlertService } from "../../services/alert.service";
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: "app-category-popup",
  templateUrl: "./category-popup.component.html",
  styleUrls: ["./category-popup.component.scss"],
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent],
})
export class CategoryPopupComponent {
  public isLoading: boolean = false;
  public categoryId: number | null = null;
  public categoryName: string = "";
  public activeModal = inject(NgbActiveModal);

  constructor(
    private categoryService: CategoryService,
    private alertService: AlertService,
  ) {}

  public onClickCategory() {
    this.isLoading = true;
    let api$: Observable<void>;
    if (this.categoryId) {
      api$ = this.categoryService.updateCategory(
        this.categoryId,
        this.categoryName,
      );
    } else {
      api$ = this.categoryService.createCategory(this.categoryName);
    }

    api$
      .pipe(
        tap(() => this.activeModal.close(true)),
        tap(() => this.alertService.success("Category saved successfully.")),
        catchError(() => this.alertService.error()),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe();
  }
}
