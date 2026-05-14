import { CommonModule } from '@angular/common';
import { Component, HostListener, input, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  // Bắt buộc phải có imports này
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideDynamicIcon],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {

  isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();
  
  navItems: NavItem[] = [
    { label: 'Trang chủ', icon: 'house', route: '/admin/dashboard' },
    { label: 'Bất động sản', icon: 'building-2', route: '/admin/properties' },
    { label: 'Liên hệ', icon: 'phone', route: '/admin/contact' },
    { label: 'Tài khoản', icon: 'circle-user', route: '/admin/account' },
    { label: 'Thông tin doanh nghiệp', icon: 'info', route: '/admin/info' },
  ];

  bottomNavItems: NavItem[] = [
    { label: 'Cá nhân', icon: 'user', route: '/admin/profile' },
    { label: 'Cài đặt', icon: 'settings', route: '/admin/setting' },
  ];


  onSignOut() {
    console.log('Signing out...');
    // Thêm logic xóa token/redirect ở đây
  }
}