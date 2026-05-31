import { Injectable, signal, computed, inject } from '@angular/core';
import { IPost, ICategory } from '../models/model';
import { ToastService } from '../services/toast.service';
import { finalize, tap } from 'rxjs';
import { PostService } from '../services/post.service';
import { CategoryService } from '../services/category.service';
import { PropertyStatus } from '../enum/enums';

export const REAL_ESTATE_POST_ID = '6a169b6722a073de8d0ca587'; // ID dùng tạm để phân biệt bài đăng bất động sản trong dropdown liên hệ

@Injectable({ providedIn: 'root' })
export class PostStore {
    private postService = inject(PostService);
    private toastService = inject(ToastService);
    private categoryService = inject(CategoryService);

    // State
    private _posts = signal<IPost[]>([]);

    private _allRealEstatePosts = signal<IPost[]>([]); // Lưu toàn bộ bài đăng bất động sản (không phân trang, không filter)
    allRealEstatePosts = this._allRealEstatePosts.asReadonly();

    private _selectedPost = signal<IPost | null>(null); // Lưu bài viết đang được chọn
    selectedPost = this._selectedPost.asReadonly();

    // Category state
    readonly categories = signal<ICategory[]>([]);
    readonly selectedCategory = signal<string | 'all'>('all');

    //Loading
    readonly loading = signal<boolean>(false);

    readonly searchQuery = signal('');
    readonly selectedSort = signal('default');
    readonly selectedStatus = signal<string | 'all'>('all');

    readonly pageSize = signal(12); // Cố định 12 post mỗi trang
    readonly currentPage = signal(1);
    readonly totalPages = signal(1);

    // Computed State (Tự động chạy lại khi các tín hiệu trên thay đổi)
    readonly filteredPosts = computed(() => {
        let result = [...this._posts()]; //Clone nó trước

        // Lọc theo tìm kiếm
        const query = this.searchQuery().toLowerCase().trim();
        if (query) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.location.toLowerCase().includes(query) ||
                p.developer.toLowerCase().includes(query)
                //p.region.toLowerCase().includes(query)
            );
        }

        // Lọc theo trạng thái bài đăng
        const status = this.selectedStatus();
        if (status !== 'all') {
            result = result.filter(p => p.status === status);
        }

        // Lọc theo sắp xếp ngày tạo
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

    
    loadAllRealEstatePosts() {
        this.loading.set(true);
        this.postService.getAllPosts(1, REAL_ESTATE_POST_ID).pipe(
            finalize(() => this.loading.set(false))
        ).subscribe({
            next: res => {
                this._allRealEstatePosts.set(res.data ?? []);
            }
        });
    }

    loadPosts() {
        this.loading.set(true);
        const page = this.currentPage();
        const categoryId = this.selectedCategory();
        this.postService.getAllPosts(page, categoryId !== 'all' ? categoryId : undefined)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => {
                    console.log('API RESPONSE:', res);
                    this._posts.set(res.data ?? []);
                    this.totalPages.set(res?.pagination?.totalPages || 1);
                    this.currentPage.set(res?.pagination?.page || 1);
                },
                error: err => {
                    this.toastService.error(err?.error?.message || 'Lỗi tải danh sách')
                    this._posts.set([]);
                    this.totalPages.set(1);
                    this.currentPage.set(1);
                }
            });
    }

    // Dùng tạm khi chưa có API public
    loadPublicPosts() {
        this.loading.set(true);
        this.postService.getAllPosts().pipe(
            finalize(() => this.loading.set(false))
        );
    }

    // Dùng tạm khi chưa có API public
    loadPublicPostsById(id: string) {
        this.loading.set(true);
        this.postService.getPostById(id).pipe(
            finalize(() => this.loading.set(false))
        );
    }

    loadCategories() {
        this.categoryService.getCategories().subscribe({
            next: res => {
                this.categories.set(res.data);
            },
            error: err => {
                this.toastService.error(err?.error?.message || 'Lỗi tải danh mục');
            }
        });
    }
    setCategory(categoryId: string) {
        this.selectedCategory.set(categoryId);
        this.currentPage.set(1);
        this.loadPosts();
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
                    this.toastService.error(err?.error?.message || 'Lỗi tải bài viết')

                }
            });
    }

    // Clear trạng thái (dùng khi thêm mới)
    clearSelectedPost() {
        this._selectedPost.set(null);
    }

    // Hàm call API dựa theo trạng thái form (thêm mới hoặc cập nhật)
    savePost(
        postId: string | null,
        postData: FormData,
        options: {
            mode: 'draft' | 'update' | 'publish' | 'create';
        }
    ) {
        console.log('Saving post with ID:', postId, 'and options:', options);

        switch (options.mode) {
            case 'draft':
            case 'create':
                postData.set('status', PropertyStatus.DRAFT);
                break;

            case 'publish':
                postData.set('status', PropertyStatus.PUBLISHED);
                break;

            case 'update':
                break;
        }

        const request$ = postId
            ? this.postService.updatePost(postId, postData)
            : this.postService.createPost(postData);

        this.loading.set(true);

        return request$.pipe(
            tap(res => {
                if (postId) {
                    this._posts.update(posts =>
                        posts.map(p => p._id === res.data._id ? res.data : p)
                    );
                } else {
                    this._posts.update(posts => [res.data, ...posts]);
                }

                this._selectedPost.set(res.data);
            }),
            finalize(() => this.loading.set(false))
        );
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

    setStatus(status: string): void {
        this.selectedStatus.set(status);
        this.currentPage.set(1);
        this.loadPosts();
    }


}