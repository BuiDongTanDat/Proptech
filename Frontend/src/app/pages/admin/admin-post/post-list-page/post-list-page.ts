import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { getPostStatusClass } from '../../../../shared/utils/helper';
import { PropertyStatus } from '../../../../core/enum/enums';
import { IPost } from '../../../../core/models/model';
import { PostStore } from '../../../../core/stores/post.store';
import { CategoryStore } from '../../../../core/stores/category.store';
import { Loading } from '../../../../shared/components/loading/loading';
import { PROPERTY_STATUS_SORT_OPTIONS } from '../../../../core/constants/post.constant';

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
    Dialog,
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
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isListView = signal(false);
  isMobile = signal(false);
  showFormDialog = signal(false);
  showDeleteConfirm = signal(false);
  formMode = signal<'view' | 'edit' | 'add'>('view');
  selectedPost = signal<IPost | null>(null);

  sortOptions = [
    { label: 'Sắp xếp', value: 'default' },
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
  ];

  statusSortOptions = PROPERTY_STATUS_SORT_OPTIONS;
  selectedCategory = signal<string>('');

  constructor() {
    effect(() => {
      const categories = this.categoryStore.categories(); // Lấy giá trị mới nhất của categories từ cái

      if (
        categories.length > 0 &&
        !this.selectedCategory()
      ) {
        const firstCategoryId = categories[0]._id ?? '';

        this.selectedCategory.set(firstCategoryId);
        this.store.setCategory(firstCategoryId);
        this.store.loadPosts();
      }
    });
  }

  ngOnInit() {
    this.onResize();
    this.categoryStore.loadCategories();
    this.store.loadPosts();
  }

  onCategoryChange(val: string) {
    this.selectedCategory.set(val);
    this.store.setCategory(val);
    this.store.loadPosts();
  }

  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  onSearch(val: string) {
    this.store.setSearch(val);
    this.store.loadPosts();
  }

  onSortChange(val: string) {
    this.store.setSort(val);
    this.store.loadPosts();
  }

  onStatusChange(val: string) {
    this.store.setStatus(val);
    this.store.loadPosts();
  }

  onPageChange(page: number) {
    this.store.setPage(page);
    this.store.loadPosts();
  }

  onExport() {
    alert('Export file!');
  }

  setListView(isList: boolean) {
    this.isListView.set(isList);
  }

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

  getPostStatusClass(status: PropertyStatus) {
    return getPostStatusClass(status);
  }
}