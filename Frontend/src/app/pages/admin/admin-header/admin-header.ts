import { Component, computed, signal, HostListener, ElementRef, inject, output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Quan trọng: Phải có cái này để dùng ngModel
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';

interface SearchItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [LucideDynamicIcon, CustomInput, FormsModule], // Thêm FormsModule
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css',
})
export class AdminHeader {
  private router = inject(Router);
  private eRef = inject(ElementRef); // Dùng để kiểm tra click outside

  toggleSidebar = output<void>();
  
  search = signal('');
  showResults = signal(false); // Signal quản lý ẩn hiện kết quả

  searchItems: SearchItem[] = [
    { label: 'Trang chủ', route: '/admin/dashboard', icon: 'house' },
    { label: 'Tin bất động sản', route: '/admin/properties', icon: 'building-2' },
    { label: 'Liên hệ', route: '/admin/contact', icon: 'phone' },
    { label: 'Tài khoản', route: '/admin/account', icon: 'circle-user' },
    { label: 'Thông tin doanh nghiệp', route: '/admin/info', icon: 'info' },
    { label: 'Cá nhân', route: '/admin/profile', icon: 'user' },
    { label: 'Cài đặt', route: '/admin/setting', icon: 'settings' },
  ];

  filteredItems = computed(() => {
    const keyword = this.search().trim().toLowerCase();
    if (!keyword) return [];

    return this.searchItems.filter((item) =>
      item.label.toLowerCase().includes(keyword)
    );
  });

  // Khi gõ phím
  onSearch(value: string) {
    this.search.set(value);
    this.showResults.set(value.length > 0);
  }

  // Khi click vào kết quả
  goTo(route: string) {
    this.router.navigate([route]);
    this.search.set(''); // Xóa nội dung search
    this.showResults.set(false); // Đóng dropdown
  }

  // Bắt sự kiện click toàn màn hình để đóng kết quả khi click ra ngoài
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showResults.set(false);
    }
  }

}