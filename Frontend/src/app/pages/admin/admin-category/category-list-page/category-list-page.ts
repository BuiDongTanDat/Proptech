
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { CategoryForm } from '../category-form/category-form';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ICategory } from '../../../../core/models/model';
import { CategoryStore } from '../../../../core/stores/category.store';
import { Loading } from '../../../../shared/components/loading/loading';
import { LucideDynamicIcon } from '@lucide/angular';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-category-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Pagination,
    Button,
    CustomInput,
    Dropdown,
    CategoryForm,
    Dialog,
    ConfirmDialog,
    Loading,
    LucideDynamicIcon,
    DatePipe
  ],
  templateUrl: './category-list-page.html',
  styleUrl: './category-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class CategoryListPage implements OnInit {
  protected readonly store = inject(CategoryStore);
  private toastService = inject(ToastService);

  // UI State
  isListView = signal(false);
  isMobile = signal(false);
  showFormDialog = signal(false);
  showDeleteConfirm = signal(false);
  formMode = signal<'view' | 'edit' | 'add'>('add');
  selectedCategory = signal<ICategory | null>(null);

  sortOptions = [
    { label: 'Sắp xếp', value: 'default' },
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
  ];

  ngOnInit(): void {
    this.store.loadCategories();
  }

  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  setListView(isList: boolean) {
    this.isListView.set(isList);

  }


  onAdd() {
    this.formMode.set('add');
    this.selectedCategory.set(null);
    this.showFormDialog.set(true);
  }

  onEdit(category: ICategory) {
    this.formMode.set('edit');
    this.selectedCategory.set(category);
    this.showFormDialog.set(true);
  }

  onView(category: ICategory) {
    this.formMode.set('view');
    this.selectedCategory.set(category);
    this.showFormDialog.set(true);
  }

  closeFormDialog() {
    this.showFormDialog.set(false);
  }

  onSaveCategory(data: { name: string; _id?: string }) {
    const action$ = this.formMode() === 'add'
      ? this.store.addCategory(data.name)
      : this.store.updateCategory(data._id!, data.name);

    if (action$) {
      action$.subscribe({
        next: (res) => {
          // Chỉ đóng form khi API trả về thành công
          this.showFormDialog.set(false);
          this.toastService.success(res.message || 'Lưu thành công'); // Hiển thị toast thành công

        },
        error: (err) => {
          // Không đóng form để user thấy lỗi hoặc sửa lại dữ liệu
          console.error('Save failed', err.error.message);
          this.toastService.error(err.error.message || 'Lưu thất bại'); // Hiển thị toast lỗi
        }
      });
    }
  }

  onDelete(category: ICategory) {
    this.selectedCategory.set(category);
    this.showDeleteConfirm.set(true);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }

  confirmDelete() {
    // TODO: Implement deleteCategory in store and call here
    this.showDeleteConfirm.set(false);
    this.showFormDialog.set(false); // Close the form after confirm
    this.store.deleteCategory(this.selectedCategory()!._id!);
  }

  onSearch(query: string) {
    this.store.setSearch(query);
  }

  onSortChange(sort: string) {
    this.store.setSort(sort);
  }

  onPageChange(page: number) {
    this.store.setPage(page);
  }
}
