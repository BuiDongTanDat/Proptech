import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { LucideDynamicIcon } from '@lucide/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { getPostStatusClass } from '../../../../shared/utils/helper';
import { PropertyStatus } from '../../../../core/enum/enums';
import { IPost } from '../../../../core/models/model';
import { PostStore } from '../../../../core/stores/post.store';
import { CategoryStore } from '../../../../core/stores/category.store';
import { Loading } from '../../../../shared/components/loading/loading';
import { PROPERTY_STATUS_SORT_OPTIONS } from '../../../../core/constants/post.constant';
import { DATE_SORT_OPTIONS } from '../../../../core/constants/general.constant';
import { AuthStore } from '../../../../core/stores/auth.store';

@Component({
  selector: 'app-post-list-page',
  imports: [
    CommonModule,
    LucideDynamicIcon,
    FormsModule,
    Pagination,
    Button,
    CustomInput,
    Dropdown,
    DatePipe,
    Loading
  ],
  templateUrl: './post-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class PostListPage implements OnInit {
  protected readonly store = inject(PostStore);
  protected readonly categoryStore = inject(CategoryStore);
  protected readonly authStore = inject(AuthStore);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isListView = signal(true);
  isMobile = signal(false);
  showFormDialog = signal(false);
  showDeleteConfirm = signal(false);
  formMode = signal<'view' | 'edit' | 'add'>('view');
  selectedPost = signal<IPost | null>(null);

  sortOptions = DATE_SORT_OPTIONS;

  statusSortOptions = PROPERTY_STATUS_SORT_OPTIONS;
  statusButtonOptions = this.statusSortOptions.map(option => ({
    ...option,
    label: option.value === 'all' ? 'Tất cả' : option.label
  }));
  categoryOptions = signal<{ label: string; value: string }[]>([]);
  showCategoryDropdown = signal(false);

  constructor() {
    effect(() => {
      const categories = this.categoryStore.categories();
      this.showCategoryDropdown.set(categories.length > 0);

      this.categoryOptions.set([
        { label: 'Tất cả danh mục', value: 'all' },
        ...categories.map(c => ({
          label: c.name,
          value: c._id ?? ''
        }))
      ]);
    });
  }

  ngOnInit() {
    this.onResize();
    this.categoryStore.loadCategories();
    this.store.loadPosts();
  }


  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  onSearch(val: string) {
    this.store.setSearch(val);
  }

  onSortChange(val: string) {
    this.store.setSort(val);
  }

  onStatusChange(val: string) {
    this.store.setStatus(val);
  }

  onCategoryChange(val: string) {
    this.store.setCategory(val);
  }

  onPageChange(page: number) {
    this.store.setPage(page);
  }

  onExport() {
    alert('Export file!');
  }

  setListView(isList: boolean) {
    this.isListView.set(isList);
  }

  //UI
  onAdd() {
    this.router.navigate(['../post/add'], {
      relativeTo: this.route
    });
  }

  onEdit(post: IPost) {
    this.router.navigate([
      'admin/post/editor',
      post._id
    ]);
  }

  onView(post: IPost) {
    this.router.navigate([
      'admin/post/view',
      post._id
    ]);
  }

  onDelete(post: IPost) {
    this.selectedPost.set(post);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    this.showDeleteConfirm.set(false);
    this.showFormDialog.set(false);
  }

  closeFormDialog() {
    this.showFormDialog.set(false);
    this.selectedPost.set(null);
  }

  cancelDelete() {
    this.showDeleteConfirm.set(false);
  }


  //Helper
  getPostStatusClass(status: PropertyStatus) {
    return getPostStatusClass(status);
  }

  getStatusCount(status: string): number {
    const statusStatics = this.store.statusStatics();

    if (status === 'all') {
      return Object.values(statusStatics).reduce((sum, count) => sum + count, 0);
    }

    return statusStatics[status] ?? 0;
  }
}