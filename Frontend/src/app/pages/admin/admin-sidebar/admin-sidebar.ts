import { CommonModule } from '@angular/common';
import { Component, HostListener, input, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Dialog } from '../../../shared/components/dialog/dialog';
import { Button } from '../../../shared/components/ui/button/button';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  // Bắt buộc phải có imports này
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideDynamicIcon, ConfirmDialog, Button],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {

  isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();

  showSignOutDialog = false;

  navItems: NavItem[] = [
    { label: 'Trang chủ', icon: 'house', route: '/admin/dashboard' },
    { label: 'Tin bất động sản', icon: 'building-2', route: '/admin/post' },
    { label: 'Liên hệ', icon: 'phone', route: '/admin/contact' },
    { label: 'Tài khoản', icon: 'circle-user', route: '/admin/account' },
    { label: 'Thông tin doanh nghiệp', icon: 'info', route: '/admin/info' },
  ];

  bottomNavItems: NavItem[] = [
    { label: 'Cá nhân', icon: 'user', route: '/admin/profile' },
    { label: 'Cài đặt', icon: 'settings', route: '/admin/setting' },
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  // Mở dialog thay vì sign out thẳng
  onSignOut() {
    this.showSignOutDialog = true;
  }

  // Người dùng xác nhận
  confirmSignOut() {
    this.showSignOutDialog = false;
    // TODO: xóa token, clear storage...
    this.authService.logout();
    this.router.navigate(['auth/login']);
  }

  // Người dùng hủy
  cancelSignOut() {
    this.showSignOutDialog = false;
  }

  
}