import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';

import {
  ContactForm,
  contactFormsList,
} from '../../../../shared/utils/data.mock';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';

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
  ],
  templateUrl: './contact-list-page.html',
})
export class ContactListPage implements OnInit {

  forms: ContactForm[] = [];
  allForms: ContactForm[] = [];
  filteredForms: ContactForm[] = [];

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
        this.filteredForms.sort((a, b) => b.id - a.id);
        break;

      case 'oldest':
        this.filteredForms.sort((a, b) => a.id - b.id);
        break;

      case 'new':
        this.filteredForms.sort((a, b) =>
          a.status === 'new' ? -1 : 1
        );
        break;

      case 'contacted':
        this.filteredForms.sort((a, b) =>
          a.status === 'contacted' ? -1 : 1
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

  onView(form: ContactForm) {}

  onDelete(form: ContactForm) {}

}