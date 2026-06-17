import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, signal, effect, computed } from '@angular/core';
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

  // Tab hiện hành
  activeTab = signal<'project' | 'news' | 'recruitment'>('project');
  tabs: { label: string; value: 'news' | 'project' | 'recruitment' }[] = [
    { label: 'Dự án', value: 'project' },
    { label: 'Tin tức', value: 'news' },
    { label: 'Tuyển dụng', value: 'recruitment' }
  ];


  sortOptions = DATE_SORT_OPTIONS;

  statusSortOptions = PROPERTY_STATUS_SORT_OPTIONS;
  statusButtonOptions = this.statusSortOptions.map(option => ({
    ...option,
    label: option.value === 'all' ? 'Tất cả' : option.label
  }));
  categoryOptions = signal<{ label: string; value: string }[]>([]);

  // Chỉ hiển thị bộ lọc danh mục khi tab hiện tại là 'Dự án' (project)
  readonly showCategoryDropdown = computed(() => {
    return this.activeTab() === 'project' && this.categoryStore.categories().length > 0;
  });

  // Tự động lọc danh sách tin hiển thị theo tab đang hoạt động
  readonly displayedPosts = computed(() => {
    const posts = this.store.filteredPosts();
    const tab = this.activeTab();
    return posts.filter(p => {
      const postType = (p as any).type || 'project';
      return postType === tab;
    });
  });

  constructor() {
    effect(() => {
      const categories = this.categoryStore.categories();
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

  // Nhận giá trị thay đổi từ ô nhập
  onSearchChange(val: string) {
    this.store.setSearch(val);
  }
  // Gọi hàm tìm kiếm khi nhấn nút Search
  onSearchClick() {
    this.store.search();
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

  onTabChange(tab: 'project' | 'news' | 'recruitment') {
    this.activeTab.set(tab);
    // Cập nhật type trong Store để loadPosts gọi đúng API theo type
    this.store.currentType.set(tab === 'project' ? 'properties' : tab);
    this.store.loadPosts(); // call API lại
  }

  onExport() {
    alert('Export file!');
  }

  setListView(isList: boolean) {
    this.isListView.set(isList);
  }

  // Sửa lỗi điều hướng sử dụng đường dẫn tuyệt đối
  onAdd(type: 'news' | 'project' | 'recruitment') {
    this.router.navigate(['/admin/post', type, 'add']);
  }

  onEdit(post: IPost) {
    const type = (post as any).type || this.route.snapshot.paramMap.get('type') || 'project';
    this.router.navigate(['/admin/post', type, 'editor', post._id]);
  }

  onView(post: IPost) {
    const type = (post as any).type || this.route.snapshot.paramMap.get('type') || 'project';
    this.router.navigate(['/admin/post', type, 'view', post._id]);
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