import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';

import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { ContactForm } from '../contact-form/contact-form';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { IContactForm } from '../../../../core/models/model';
import { contactFormsList } from '../../../../shared/utils/data.mock';

@Component({
  selector: 'app-contact-forms-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideDynamicIcon,
    Pagination,
    Button,
    CustomInput,
    Dropdown,
    ContactForm,
    Dialog
  ],
  templateUrl: './contact-list-page.html',
})
export class ContactListPage implements OnInit {

  forms: IContactForm[] = [];
  allForms: IContactForm[] = [];
  filteredForms: IContactForm[] = [];

  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  isListView = false;
  isMobile = false;

  searchQuery = '';

  sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Chưa xử lý', value: 'new' },
    { label: 'Đã liên hệ', value: 'contacted' },
  ];

  selectedSort = 'newest';

  ngOnInit(): void {
    this.checkMobile();

    this.allForms = contactFormsList;
    this.filteredForms = [...this.allForms];

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

    this.filteredForms = this.allForms.filter(form =>
      form.fullName.toLowerCase().includes(q) ||
      form.email.toLowerCase().includes(q) ||
      form.phone.includes(q)
    );

    this.currentPage = 1;
    this.updatePage();
  }

  onSortChange(value: string) {
    this.selectedSort = value;

    switch (value) {

      case 'newest':
        this.filteredForms.sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        break;

      case 'oldest':
        this.filteredForms.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
        break;

      case 'new':
        this.filteredForms.sort((a, b) =>
          a.status === 'Mới' ? -1 : 1
        );
        break;

      case 'contacted':
        this.filteredForms.sort((a, b) =>
          a.status === 'Đang xử lý' ? -1 : 1
        );
        break;

    }

    this.updatePage();
  }

  updatePage() {

    this.totalPages =
      Math.ceil(this.filteredForms.length / this.pageSize) || 1;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;

    this.forms = this.filteredForms.slice(
      start,
      start + this.pageSize
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePage();
  }


  // Form state 
  showFormDialog = false;
  formMode: 'view' | 'edit' | 'add' = 'view';
  selectedForm: IContactForm | null = null;

  onAdd() {
    this.formMode = 'add';
    this.selectedForm = null;
    this.showFormDialog = true;
  }

  onView(form: IContactForm) {
    this.formMode = 'view';
    this.selectedForm = form;
    this.showFormDialog = true;
  }

  onEdit(form: IContactForm) {
    this.formMode = 'edit';
    this.selectedForm = form;
    this.showFormDialog = true;
  }

  onDelete(form: IContactForm) {
    this.allForms = this.allForms.filter(
      f => f.id !== form.id
    );
    this.filteredForms = this.filteredForms.filter(
      f => f.id !== form.id
    );
    if (
      (this.currentPage - 1) * this.pageSize >=
      this.filteredForms.length &&
      this.currentPage > 1
    ) {
      this.currentPage--;
    }
    this.updatePage();
  }

  onSaveForm(formData: any) { // Chuyển thành any hoặc một interface không bắt buộc ID
    if (this.formMode === 'add') {
      // Tạo object mới hoàn chỉnh với ID
      const newForm: IContactForm = {
        ...formData,
        id: Date.now(), // Tạo ID tạm thời bằng timestamp
        createdAt: new Date().toLocaleDateString('vi-VN') // Thêm ngày tạo nếu cần
      };
      this.allForms.unshift(newForm);
    } else if (this.formMode === 'edit' && this.selectedForm) {
      // Cập nhật và giữ nguyên ID cũ
      const updatedForm: IContactForm = {
        ...formData,
        id: this.selectedForm.id,
        createdAt: this.selectedForm.createdAt
      };
      this.allForms = this.allForms.map(f =>
        f.id === updatedForm.id ? updatedForm : f
      );
    }

    this.filteredForms = [...this.allForms];
    this.updatePage();
    this.closeFormDialog();
  }

  closeFormDialog() {
    this.showFormDialog = false;
    this.selectedForm = null;
  }






}