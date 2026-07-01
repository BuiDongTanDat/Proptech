import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Button } from "../../../components/ui/button/button";
import { LucideDynamicIcon } from '@lucide/angular';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    Button,
    LucideDynamicIcon
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
  host: {
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class Header {

  navItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Dự án', path: '/properties' },
    { label: 'Tin tức', path: '/news' },
    { label: 'Tuyển dụng', path: '/jobs' },
    { label: 'Về chúng tôi', path: '/about' },
  ]

  // Trạng thái đóng mở menu trên mobile
  isMobileMenuOpen = false;
  isScrolled: boolean = false;
  hideNavbar = false;
  private lastScrollTop = 0;


  // Lắng nghe sự kiện scroll của window
  onWindowScroll(): void {
    const currentScroll =
      window.pageYOffset ||
      document.documentElement.scrollTop;

    this.isScrolled = currentScroll > 20;

    if (currentScroll > this.lastScrollTop && currentScroll > 100) {
      // scroll xuống
      this.hideNavbar = true;
    } else {
      // scroll lên
      this.hideNavbar = false;
    }

    this.lastScrollTop = Math.max(currentScroll, 0);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
