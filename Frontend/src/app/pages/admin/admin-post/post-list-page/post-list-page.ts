
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, HostListener, ChangeDetectionStrategy, inject, signal } from '@angular/core';
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


@Component({
  selector: 'app-post-list-page',
  standalone: true,
  imports: [
    CommonModule,
    LucideDynamicIcon,
    FormsModule,
    Pagination,
    Button,
    CustomInput,
    Dropdown,
    Dialog,
    DatePipe
  ],
  templateUrl: './post-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class PostListPage implements OnInit {

  protected readonly store = inject(PostStore);
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
  selectedSort = 'newest';


  ngOnInit() {
    this.onResize();
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

  onPageChange(page: number) {
    this.store.setPage(page);
  }

  onExport() {
    // TODO: Export logic
    alert('Export file!');
  }

  setListView(isList: boolean) {
    this.isListView.set(isList);

  }


  // CRUD UI Handlers
  onAdd() {
    // Chuyển sang trang thêm bài viết mới
    this.router.navigate(['../post/add'], {
      relativeTo: this.route
    });
  }

  onEdit(post: IPost) {
    // Chuyển sang trang chỉnh sửa với ID của bài viết
    this.router.navigate([
      'admin/post/editor',
      post._id
    ]);

  }

  onView(post: IPost) {
    // Chuyển sang trang xem chi tiết với ID của bài viết
    this.router.navigate([
      'admin/post/view',
      post._id
    ]);

  }

  onDelete(post: IPost) {
    // Called from form: keep form open, just show confirm dialog
    this.selectedPost.set(post);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    const post = this.selectedPost();
    // if (post?._id) {
    //   this.store.deletePost(post._id);
    // }
    this.showDeleteConfirm.set(false);
    this.showFormDialog.set(false); // Close the form after confirm
  }

  // Đóng form dialog
  closeFormDialog() {
    this.showFormDialog.set(false);
    this.selectedPost.set(null);
  }

  // Hủy delete dialog
  cancelDelete() {
    this.showDeleteConfirm.set(false);
    // Do not close the form, just hide confirm dialog
  }

  getPostStatusClass(status: PropertyStatus) {
    return getPostStatusClass(status);
  }


}