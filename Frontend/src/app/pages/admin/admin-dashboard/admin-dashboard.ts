import { Component, OnInit, computed, inject } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { Button } from '../../../shared/components/ui/button/button';
import { NgApexchartsModule } from 'ng-apexcharts';
import { CommonModule } from '@angular/common';
import { UserStore } from '../../../core/stores/users.store';
import { PostStore } from '../../../core/stores/post.store';
import { ContactsStore } from '../../../core/stores/contacts.store';
import { ContactStatus } from '../../../core/enum/enums';
import { getContactStatusClass } from '../../../shared/utils/helper';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideDynamicIcon, Button, NgApexchartsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  readonly userStore = inject(UserStore);
  readonly postStore = inject(PostStore);
  readonly contactStore = inject(ContactsStore);

  readonly contactStatus = ContactStatus;

  // Top-level stats
  readonly totalPosts = this.postStore.totalPosts;
  readonly totalContacts = this.contactStore.totalMessages;

  readonly publishedCount = computed(() => {
    const statics = this.postStore.statusStatics();
    return statics?.['Xuất bản'] ?? statics?.['published'] ?? 0;
  });

  readonly recentContacts = computed(() =>
    this.contactStore.contacts().slice(0, 5)
  );

  // Staff breakdown with colors
  readonly staffBreakdown = computed(() => [
    {
      label: 'Quản lý',
      count: this.userStore.filteredUsers().filter(u => u.role === 'Quản lý').length,
      color: '#1A2B48',
    },
    {
      label: 'Nhân viên',
      count: this.userStore.filteredUsers().filter(u => u.role === 'Nhân viên').length,
      color: '#F26419',
    },
    {
      label: 'Thực tập sinh',
      count: this.userStore.filteredUsers().filter(u => u.role === 'Thực tập sinh').length,
      color: '#64748b',
    },
  ]);

  // Contact status stats with progress bar
  readonly contactStatusStats = computed(() => {
    const statics = this.contactStore.statusStatics();
    const total = Object.values(statics).reduce((a, b) => a + b, 0) || 1;
    return [
      {
        label: 'Chờ xử lý',
        count: statics?.['Chờ xử lý'] ?? statics?.['pending'] ?? 0,
        percent: Math.round(((statics?.['Chờ xử lý'] ?? 0) / total) * 100),
        icon: 'clock',
        bgClass: 'bg-gray-100',
        iconClass: 'text-gray-500',
        barClass: 'bg-gray-400',
      },
      {
        label: 'Đang xử lý',
        count: statics?.['Đang xử lý'] ?? statics?.['in_progress'] ?? 0,
        percent: Math.round(((statics?.['Đang xử lý'] ?? 0) / total) * 100),
        icon: 'loader',
        bgClass: 'bg-yellow-50',
        iconClass: 'text-yellow-600',
        barClass: 'bg-yellow-400',
      },
      {
        label: 'Đã giải quyết',
        count: statics?.['Đã giải quyết'] ?? statics?.['resolved'] ?? 0,
        percent: Math.round(((statics?.['Đã giải quyết'] ?? 0) / total) * 100),
        icon: 'check-circle',
        bgClass: 'bg-green-50',
        iconClass: 'text-green-600',
        barClass: 'bg-green-500',
      },
    ];
  });

  // Helper: extract weekday from MongoDB ObjectId
  private getDateFromId(id: string): string {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;

    const d = new Date(timestamp);

    const map = [
      'Chủ Nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7',
    ];

    return map[d.getDay()];
  }

  // Main chart series
  readonly mainChartSeries = computed(() => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];

    const postCounts = new Array(7).fill(0);
    const contactCounts = new Array(7).fill(0);

    this.postStore.filteredPosts().forEach(p => {
      const day = this.getDateFromId(p._id!);
      const idx = days.indexOf(day);
      if (idx !== -1) postCounts[idx]++;
    });

    this.contactStore.contacts().forEach(c => {
      const day = this.getDateFromId(c._id!);
      const idx = days.indexOf(day);
      if (idx !== -1) contactCounts[idx]++;
    });

    return [
      { name: 'Tin đăng mới', data: [...postCounts] },
      { name: 'Yêu cầu liên hệ', data: [...contactCounts] },
    ];
  });

  // Staff chart series
  readonly staffChartSeries = computed(() => {
    const roleMap = [
      { key: 'Quản lý', label: 'Quản lý' },
      { key: 'Nhân viên', label: 'Nhân viên' },
      { key: 'Thực tập sinh', label: 'Thực tập sinh' },
    ];
    return [{
      name: 'Nhân sự',
      data: roleMap.map(r => ({
        x: r.label,
        y: this.userStore.filteredUsers().filter(u => u.role === r.key).length,
      })),
    }];
  });

  public mainChartOptions: any = {
    chart: {
      height: 260,
      type: 'area',
      toolbar: { show: false },
      fontFamily: 'inherit',
      sparkline: { enabled: false },
    },
    colors: ['#1A2B48', '#F26419'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.02,
        stops: [0, 95, 100],
      },
    },
    xaxis: {
      categories: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '11px', colors: '#9ca3af' } },
    },
    yaxis: {
      labels: {
        style: { fontSize: '11px', colors: '#9ca3af' },
        formatter: (val: number) => Math.round(val),
      },
    },
    grid: {
      borderColor: 'rgba(26,43,72,0.06)',
      strokeDashArray: 4,
      padding: { left: 0, right: 0 },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '11px',
      markers: { size: 6, shape: 'circle' },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontSize: '12px' },
    },
  };

  public staffChartOptions: any = {
    chart: {
      type: 'bar',
      height: 140,
      toolbar: { show: false },
      fontFamily: 'inherit',
    },
    colors: ['#1A2B48', '#F26419', '#64748b'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '35%',
        distributed: true,
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { fontSize: '11px', colors: '#9ca3af' } },
    },
    yaxis: {
      labels: {
        style: { fontSize: '11px', colors: '#9ca3af' },
        formatter: (val: number) => Math.round(val),
      },
    },
    grid: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: { style: { fontSize: '12px' } },
  };



  ngOnInit() {
    this.postStore.loadPosts();
    this.contactStore.loadContacts();
    this.userStore.loadUsers();
  }

  getContactStatusClass(status: ContactStatus): string {
    return getContactStatusClass(status);
  }
}