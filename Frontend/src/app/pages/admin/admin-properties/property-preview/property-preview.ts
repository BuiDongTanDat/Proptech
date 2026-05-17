import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { propertiesList } from '../../../../shared/utils/data.mock';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-property-preview',
  templateUrl: './property-preview.html',
  imports: [
    Button,
    LucideDynamicIcon,
  ]
})
export class PropertyPreview implements OnInit, OnDestroy {
  displayUrl: SafeResourceUrl | null = null;
  propertyId: number | null = null;
  private blobUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const property = propertiesList.find(p => p.id === id);

    if (property?.htmlSource) {
      this.propertyId = id;

      // 1. Tạo một Blob từ chuỗi HTML
      const blob = new Blob([property.htmlSource], { type: 'text/html' });

      // 2. Tạo đường dẫn tạm thời
      this.blobUrl = URL.createObjectURL(blob);

      // 3. Bypass security để Angular cho phép gán vào [src]
      this.displayUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl);
    }
  }

  ngOnDestroy() {
    // Giải phóng bộ nhớ khi rời trang
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  onEdit() {
    if (!this.propertyId) return;

    this.router.navigate([
      '/admin/properties/editor',
      this.propertyId,
    ]);
  }

  goBack() {
    window.history.back();
  }
}