import { Component } from '@angular/core';
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
  sidebarCollapsed = false;
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}
