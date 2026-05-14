import { Component, HostListener, OnInit, signal } from '@angular/core';
import { AdminHeader } from '../../../pages/admin/admin-header/admin-header';
import { AdminSidebar } from '../../../pages/admin/admin-sidebar/admin-sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    AdminSidebar,
    AdminHeader,
    RouterOutlet
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  onToggleSidebar() {
    this.isLeftSidebarCollapsed.update(collapsed => !collapsed);
  }

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
      else {
        this.isLeftSidebarCollapsed.set(false);
      }
  }

  @HostListener('window:load')
  onLoad() {
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }




}
