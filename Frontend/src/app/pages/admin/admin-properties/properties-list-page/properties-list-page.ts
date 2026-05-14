
import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { propertiesList, Property } from '../../../../shared/utils/data.mock';
import { LucideDynamicIcon } from '@lucide/angular';
import { PropertiesForm } from '../properties-form/properties-form';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-properties-list-page',
  standalone: true,
  imports: [
    CommonModule,
    LucideDynamicIcon,
    FormsModule,
    Pagination,
    Button,
    CustomInput,
    Dropdown,
    PropertiesForm,
    Dialog,
  ],
  templateUrl: './properties-list-page.html',
})
export class PropertiesListPage implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  properties: Property[] = [];
  allProperties: Property[] = [];
  filteredProperties: Property[] = [];

  currentPage = 1;
  pageSize = 3;
  totalPages = 1;

  isListView = false;
  isMobile = false;
  searchQuery = '';

  sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Giá: Cao → Thấp', value: 'price-desc' },
    { label: 'Giá: Thấp → Cao', value: 'price-asc' },
  ];
  selectedSort = 'newest';

  // Form state 
  showFormDialog: boolean = false;
  formMode: 'view' | 'edit' | 'add' = 'view';
  selectedProperty: Property | null = null;

  ngOnInit() {
    this.checkMobile();
    this.allProperties = propertiesList;
    this.filteredProperties = [...this.allProperties];
    this.onSortChange();
    this.updatePage();
  }
  onExport() {
    // TODO: Export logic
    alert('Export file!');
  }

  onAdd() {
    // // TODO: Add property logic
    // this.formMode = 'add';
    // this.selectedProperty = null;
    // this.showFormDialog = true;
    // alert('Thêm BĐS mới!');
    this.router.navigate(['../properties/add'], {
      relativeTo: this.route
    });
  }

  onEdit(property: Property) {
    this.formMode = 'edit';
    this.selectedProperty = property;
    this.showFormDialog = true;
  }

  onView(property: Property) {
    this.formMode = 'view';
    this.selectedProperty = property;
    this.showFormDialog = true;
  }

  onDelete(property: Property) {
    this.allProperties = this.allProperties.filter(p => p.id !== property.id);
    this.filteredProperties = this.filteredProperties.filter(p => p.id !== property.id);
    if ((this.currentPage - 1) * this.pageSize >= this.filteredProperties.length && this.currentPage > 1) {
      this.currentPage--;
    }
    this.updatePage();
  }


  onSaveProperty(property: Property) {

    if (this.formMode === 'add') {

      this.allProperties.unshift(property);

    } else if (this.formMode === 'edit') {

      this.allProperties = this.allProperties.map(p =>
        p.id === property.id ? property : p
      );
    }

    this.filteredProperties = [...this.allProperties];
    this.updatePage();
    this.showFormDialog = false;
    this.selectedProperty = null;
  }

  closeFormDialog() {
    this.showFormDialog = false;
    this.selectedProperty = null;
  }

  onFilter() {
    // TODO: Filter logic

    alert('Bộ lọc!');
  }

  onSortChange() {

    switch (this.selectedSort) {

      case 'newest':
        this.filteredProperties.sort((a, b) => b.id - a.id);
        break;

      case 'oldest':
        this.filteredProperties.sort((a, b) => a.id - b.id);
        break;

      case 'price-desc':
        this.filteredProperties.sort((a, b) => Number(b.price) - Number(a.price));
        break;

      case 'price-asc':
        this.filteredProperties.sort((a, b) => Number(a.price) - Number(b.price));
        break;
    }

    this.currentPage = 1;

    this.updatePage();
  }



  @HostListener('window:resize')
  onResize() { this.checkMobile(); }

  checkMobile() { this.isMobile = window.innerWidth < 768; }

  setView(listView: boolean) { this.isListView = listView; }

  onSearch() {
    const q = this.searchQuery.toLowerCase();
    this.filteredProperties = this.allProperties.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.typologies.some(t => t.toLowerCase().includes(q))
    );
    this.currentPage = 1;
    this.updatePage();
  }

  updatePage() {
    this.totalPages =
      Math.ceil(this.filteredProperties.length / this.pageSize) || 1;

    // tránh currentPage vượt quá totalPages
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;

    this.properties = this.filteredProperties.slice(
      start,
      start + this.pageSize
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePage();
  }



}