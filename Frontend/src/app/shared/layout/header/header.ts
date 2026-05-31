import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from "../../components/ui/button/button";
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    Button,
],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  navItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Tin bất động sản', path: '/properties' },
    { label: 'Về chúng tôi', path: '/about' },
  ]

  isScrolled: boolean = false;

  // Lắng nghe sự kiện scroll của window
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Nếu cuộn xuống quá 20px thì đặt isScrolled = true
    this.isScrolled = window.scrollY > 20;
  }
}
