import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { AuthService } from '../../../core/services/auth.service';
import { Button } from '../../../shared/components/ui/button/button';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { AuthStore } from '../../../core/stores/auth.store';

export interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: {
    label: string;
    icon: string;
    route: string
  }[]; // Danh sách menu con
}

@Component({
  selector: 'app-admin-sidebar',
  // standalone: true,
  // Bắt buộc phải có imports này
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideDynamicIcon, ConfirmDialog, Button],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
})
export class AdminSidebar {

  private router = inject(Router);
  private store = inject(AuthStore);

  isLeftSidebarCollapsed = input.required<boolean>();
  screenWidth = input.required<number>();

  // Emit để parent mở sidebar
  expandSidebar = output<void>();
  showSignOutDialog = false;



  // Quản lý trạng thái đóng/mở của các menu con bằng cách 
  // lưu trữ label của menu đang mở
  openSubMenus = signal<Record<string, boolean>>({});

  navItems: NavItem[] = [
    { label: 'Trang chủ', icon: 'house', route: '/admin/dashboard' },

    // Menu Bất động sản có thêm dropdown con
    {
      label: 'Bài đăng',
      icon: 'inbox',
      children: [
        { label: 'Danh mục', icon: 'list', route: '/admin/category' },
        { label: 'Tin đăng', icon: 'building-2', route: '/admin/post' }
      ]
    },
    { label: 'Liên hệ', icon: 'phone', route: '/admin/contact' },
    { label: 'Tài khoản', icon: 'circle-user', route: '/admin/account' },
    // { label: 'Thông tin doanh nghiệp', icon: 'info', route: '/admin/info' },
  ];

  bottomNavItems: NavItem[] = [
    // { label: 'Cá nhân', icon: 'user', route: '/admin/profile' },
    // { label: 'Cài đặt', icon: 'settings', route: '/admin/setting' },
  ];

  // Hàm toggle đóng/mở menu con
  toggleSubMenu(label: string) {
    if (this.isLeftSidebarCollapsed()) {
      // Emit để parent expand sidebar, sau đó mở submenu
      this.expandSidebar.emit();
      setTimeout(() => {
        this.openSubMenus.update(state => ({ ...state, [label]: true }));
      }, 320); // khớp với transition 300ms của sidebar
      return;
    }
    this.openSubMenus.update(state => ({ ...state, [label]: !state[label] }));
  }

  // Kiểm tra xem menu con có đang mở hay không
  isSubMenuOpen(label: string): boolean {
    return !!this.openSubMenus()[label];
  }


  // Kiểm tra xem có menu con nào đang active theo URL không
  isParentActive(item: NavItem): boolean {
    if (!item.children) return false;

    return item.children.some(child =>
      this.router.url.startsWith(child.route)
    );
  }

  // Mở dialog thay vì sign out thẳng
  onSignOut() {
    this.showSignOutDialog = true;
  }

  // Người dùng xác nhận
  confirmSignOut() {
    this.showSignOutDialog = false;
    this.store.logout().subscribe({
      next: () => {
        // Sau khi logout thành công, điều hướng về trang login
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // Có thể xử lý lỗi nếu cần
      }
    });
  }

  // Người dùng hủy
  cancelSignOut() {
    this.showSignOutDialog = false;
  }


}