/* eslint-disable @angular-eslint/directive-selector */
import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[autoResize]",
  standalone: true,
})
export class AutoResizeDirective {
  constructor(private elementRef: ElementRef) {}

  @HostListener("input", ["$event"])
  onInput(): void {
    this.adjustTextareaHeight();
  }

  private adjustTextareaHeight(): void {
    const textarea = this.elementRef.nativeElement as HTMLTextAreaElement;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
