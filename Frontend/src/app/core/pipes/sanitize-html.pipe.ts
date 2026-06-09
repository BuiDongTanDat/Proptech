// Pipe này dùng để chuyển đổi HTML string thành SafeHtml để có thể hiển thị an toàn trong Angular templates
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeHtml',
  standalone: true
})
export class SanitizeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}