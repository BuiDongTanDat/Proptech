import { Injectable, signal, computed, inject } from '@angular/core';
import { IPost } from '../models/model';
import { ToastService } from '../services/toast/toast.service';
import { finalize } from 'rxjs';
import { PostService } from '../services/post/post.service';
import { Router } from '@angular/router';


@Injectable({ providedIn: 'root' })
export class PostStore {
    private postService = inject(PostService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    // State
    private _posts = signal<IPost[]>([]);
    private _selectedPost = signal<IPost | null>(null); // Lưu bài viết đang được chọn
    selectedPost = this._selectedPost.asReadonly();

    //Loading
    readonly loading = signal<boolean>(false);

    readonly searchQuery = signal('');
    readonly selectedSort = signal('default');

    readonly pageSize = signal(12); // Cố định 12 post mỗi trang
    readonly currentPage = signal(1);
    readonly totalPages = signal(1);

    // Computed State (Tự động chạy lại khi các tín hiệu trên thay đổi)
    readonly filteredPosts = computed(() => {
        let result = [...this._posts()]; //Clone nó trước
        const query = this.searchQuery().toLowerCase().trim();
        if (query) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.location.toLowerCase().includes(query) ||
                p.developer.toLowerCase().includes(query) ||
                p.region.toLowerCase().includes(query)
            );
        }
        switch (this.selectedSort()) {
            case 'newest':
                result.sort((a, b) => {
                    const dateA = new Date(a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
                    const dateB = new Date(b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
                    return dateB.getTime() - dateA.getTime();
                });
                break;
            case 'oldest':
                result.sort((a, b) => {
                    const dateA = new Date(a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
                    const dateB = new Date(b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
                    return dateA.getTime() - dateB.getTime();
                });
                break;
            case 'default':
            default:
                break;
        }
        return result;
    }
    );


    loadPosts() {
        this.loading.set(true);
        const params = {
            page: this.currentPage(),
            limit: this.pageSize(),
            search: this.searchQuery(),
            sort: this.selectedSort()
        };
        this.postService.getAllPosts(params)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => {
                    console.log('API RESPONSE:', res);
                    this._posts.set(res.data);
                    this.totalPages.set(res?.pagination?.totalPages || 1);
                    this.currentPage.set(res?.pagination?.page || 1);
                },
                error: err => this.toastService.error(err?.message || 'Lỗi tải danh sách')
            });
    }

    loadPostById(id: string): void {
        this.loading.set(true);
        // Reset selected post trước khi tải mới
        this._selectedPost.set(null);

        this.postService.getPostById(id)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => {
                    console.log('API RESPONSE:', res);
                    this._selectedPost.set(res.data);
                },

                error: err => {
                    this.toastService.error(err?.message || 'Lỗi tải bài viết')

                }
            });
    }

    // Clear trạng thái (dùng khi thêm mới)
    clearSelectedPost() {
        this._selectedPost.set(null);
    }

    addPost(postData: FormData): void {
        this.loading.set(true);
        this.postService.createPost(postData)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => {
                    this._posts.update(posts => [res.data, ...posts]);
                    this.toastService.success('Thêm bài viết thành công');
                    this.router.navigate(['admin/post/']);
                },
                error: err =>
                    this.toastService.error(err?.message || 'Lỗi thêm bài viết')
            });
    }

    updatePost(id: string, postData: FormData): void {
        this.loading.set(true);
        this.postService.updatePost(id, postData)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => {
                    this._posts.update(posts =>
                        posts.map(p => p._id === res.data._id ? res.data : p)
                    );
                    this.toastService.success(res?.message || 'Cập nhật bài viết thành công');
                    this.router.navigate(['admin/post/editor', res.data._id]);
                },
                error: err =>
                    this.toastService.error(err?.message || 'Lỗi cập nhật bài viết')
            });


    }

    setPage(page: number) {
        // Nếu page mới không hợp lệ, giữ nguyên page hiện tại
        if (page < 1 || page > this.totalPages()) return;

        this.currentPage.set(page);
        this.loadPosts();
    }

    setSearch(query: string): void {
        this.searchQuery.set(query);
        this.currentPage.set(1);
        this.loadPosts();
    }

    setSort(sort: string): void {
        this.selectedSort.set(sort);
        this.currentPage.set(1);
        this.loadPosts();
    }


}