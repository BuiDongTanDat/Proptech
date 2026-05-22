import { Component, inject } from '@angular/core';
import { Button } from '../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [
    Button,
    LucideDynamicIcon
  ],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {

  private router = inject(Router);
  onBack() {
    this.router.navigate(['/']); // Điều hướng về trang chủ hoặc trang mong muốn
  }
}
