import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { UserAccount, usersList } from '../../../../shared/utils/data.mock';
import { UsersForm } from '../users-form/users-form';
import { Dialog } from '../../../../shared/components/dialog/dialog';


@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideDynamicIcon,
    Pagination,
    Button,
    CustomInput,
    Dropdown,
    UsersForm,
    Dialog
  ],
  templateUrl: './users-list-page.html',
})
export class UsersListPage implements OnInit {

  users: UserAccount[] = [];
  allUsers: UserAccount[] = [];
  filteredUsers: UserAccount[] = [];

  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  isListView = false;
  isMobile = false;
  searchQuery = '';

  sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Admin trước', value: 'admin' },
    { label: 'Nhân viên trước', value: 'staff' },
  ];

  selectedSort = 'newest';

  // Form state
  showFormDialog: boolean = false;
  formMode: 'view' | 'edit' | 'add' = 'view';
  selectedUser: UserAccount | null = null;


  ngOnInit(): void {
    this.checkMobile();

    this.allUsers = usersList;

    this.filteredUsers = [...this.allUsers];
    this.updatePage();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  setView(listView: boolean) {
    this.isListView = listView;
  }

  onSearch() {
    const q = this.searchQuery.toLowerCase();

    this.filteredUsers = this.allUsers.filter(user =>
      user.fullName.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.phone.includes(q)
    );

    this.currentPage = 1;
    this.updatePage();
  }

  onSortChange(value: string) {
    this.selectedSort = value;

    switch (value) {
      case 'newest':
        this.filteredUsers.sort((a, b) => b.id - a.id);
        break;

      case 'oldest':
        this.filteredUsers.sort((a, b) => a.id - b.id);
        break;

      case 'admin':
        this.filteredUsers.sort((a, b) =>
          a.role === 'admin' ? -1 : 1
        );
        break;

      case 'staff':
        this.filteredUsers.sort((a, b) =>
          a.role === 'staff' ? -1 : 1
        );
        break;
    }

    this.updatePage();
  }

  updatePage() {
    this.totalPages =
      Math.ceil(this.filteredUsers.length / this.pageSize) || 1;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;

    this.users = this.filteredUsers.slice(
      start,
      start + this.pageSize
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePage();
  }

  

  onAdd() {
    this.formMode = 'add';
    this.selectedUser = null;
    this.showFormDialog = true;
  }

  onEdit(user: UserAccount) {
    this.formMode = 'edit';
    this.selectedUser = user;
    this.showFormDialog = true;
  }

  onView(user: UserAccount) {
    this.formMode = 'view';
    this.selectedUser = user;
    this.showFormDialog = true;
  }

  onDelete(user: UserAccount) {
    this.allUsers = this.allUsers.filter(u => u.id !== user.id);
    this.filteredUsers = this.filteredUsers.filter(u => u.id !== user.id);

    if ((this.currentPage - 1) * this.pageSize >= this.filteredUsers.length && this.currentPage > 1) {
      this.currentPage--;
    }

    this.updatePage();
  }

  closeFormDialog() {
    this.showFormDialog = false;
    this.selectedUser = null;
  }
}