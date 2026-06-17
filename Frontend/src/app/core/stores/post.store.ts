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
    // Mặc định là 'properties' (Dự án)
    readonly currentType = signal<string>('properties');

    private _posts = signal<IPost[]>([]);

    private _statusStatics = signal<{ [key: string]: number }>({});
    statusStatics = this._statusStatics.asReadonly();

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
    readonly totalPosts = signal(0);

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
        this.postService.getAllPublicPosts(this.currentType()).pipe(
            finalize(() => this.loading.set(false))
        ).subscribe({
            next: res => {
                this._allRealEstatePosts.set(res.data.posts ?? []);
            }
        });
    }



    // Hàm quan trọng nhất: Thiết lập loại bài đăng và tải lại toàn bộ
    setType(type: string) {
        this.currentType.set(type);
        this.currentPage.set(1);
        this.searchQuery.set('');
        this.selectedStatus.set('all');
        this.loadPosts();
    }

    loadPosts() {
        this.loading.set(true);
        this.postService.getAllPosts(
            this.currentType(),
            this.currentPage(),
            this.selectedCategory() !== 'all' ? this.selectedCategory() : undefined,
            this.selectedStatus() !== 'all' ? this.selectedStatus() : undefined)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => {
                    console.log('API RESPONSE:', res);
                    const posts = res?.data?.posts ?? [];
                    this._posts.set(posts);
                    this._statusStatics.set(
                        res?.data?.status ?? {}
                    );
                    this.totalPages.set(
                        res?.pagination?.totalPages ?? 1
                    );
                    this.currentPage.set(
                        res?.pagination?.page ?? 1
                    );
                    this.totalPosts.set(
                        res?.pagination?.totalPosts ?? 0
                    );
                },
                error: err => {
                    this.toastService.error(err?.error?.message || 'Lỗi tải danh sách')
                    this._posts.set([]);
                    this.totalPages.set(1);
                    this.currentPage.set(1);
                }
            });
    }

    // Tìm kiếm bài đăng dựa theo từ khóa (admin)
    searchPosts() {
        this.loading.set(true);
        this.postService.searchPosts(
            this.currentType(),
            this.currentPage(),
            this.searchQuery().trim()
        )
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => {
                    this._posts.set(res?.data?.posts ?? []);
                    this._statusStatics.set(res?.data?.status ?? {});
                    this.totalPages.set(res?.pagination?.totalPages ?? 1);
                    this.totalPosts.set(res?.pagination?.totalPosts ?? 0);
                },
                error: (err) => this.toastService.error(err.error?.message || 'Lỗi tìm kiếm bài viết')
            });
    }

    loadPostById(id: string): void {
        this.loading.set(true);
        // Reset selected post trước khi tải mới
        this._selectedPost.set(null);

        this.postService.getPostById(this.currentType(), id)
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


    // Hàm call API dựa theo trạng thái form (thêm mới hoặc cập nhật)
    savePost(
        postId: string | null,
        postData: FormData,
    ) {
        const type = this.currentType();
        const request$ = postId
            ? this.postService.updatePost(type, postId, postData)
            : this.postService.createPost(type, postData);

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

    updatePostStatus(
        id: string,
        status: PropertyStatus,
        reason?: string
    ) {
        this.loading.set(true);
        console.log(`Updating post ${id} to status ${status} with reason:`, reason);
        return this.postService
            .updatePostStatus(
                this.currentType(),
                id, {
                status,
                reason,
            })
            .pipe(
                tap(() => {
                    this.loadPostById(id); // Tải lại bài viết để cập nhật trạng thái mới nhất (bao gồm cả lý do từ chối nếu có)
                }),
                finalize(() => this.loading.set(false))
            );
    }

    // Dùng tạm khi chưa có API public
    loadPublicPosts() {
        this.loading.set(true);
        this.postService.getAllPublicPosts(this.currentType(), this.currentPage())
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => {
                    this._posts.set(res.data.posts);
                    this._allRealEstatePosts.set(res.data.posts); // Cập nhật danh sách bài đăng bất động sản công khai
                    this.totalPages.set(res.pagination.totalPages);
                }
            });
    }

    // Dùng tạm khi chưa có API public
    loadPublicPostById(id: string) {
        this.loading.set(true);
        this.postService.getPublicPostById(this.currentType(), id)
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => this._selectedPost.set(res.data)
            });
    }

    // Helper
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

    // Clear trạng thái (dùng khi thêm mới)
    clearSelectedPost() {
        this._selectedPost.set(null);
    }

    readonly isAdminMode = signal<boolean>(false);
    setPage(page: number) {
        if (page < 1 || page > this.totalPages()) return;
        this.currentPage.set(page);

        if (this.isAdminMode()) {
            this.loadData(); // Gọi API admin
        } else {
            this.loadPublicData(); // Gọi API public
        }
    }

    // Cập nhật giá trị cho ô nhập
    setSearch(query: string): void {
        this.searchQuery.set(query);
        // this.currentPage.set(1);
    }

    setSort(sort: string): void {
        this.selectedSort.set(sort);
        this.currentPage.set(1);

    }

    setStatus(status: string): void {
        this.selectedStatus.set(status);
        this.currentPage.set(1);
        this.loadPosts();

    }

    private loadData() {
        const keyword = this.searchQuery().trim();

        // Nếu có keyword thì gọi API tìm kiếm,
        if (keyword) {
            this.searchPosts();
        } else {
            //  nếu không có thì gọi API lấy tất cả bài đăng (theo filter hiện tại)
            this.loadPosts();
        }
    }

    // Khi người dùng nhấn nút tìm kiếm, reset page về 1 và gọi loadData
    search(): void {
        this.currentPage.set(1);
        this.loadData();
    }

    searchPublic(): void {
        this.currentPage.set(1);
        this.loadPublicData();
    }

    //Logic tải dữ liệu công khai (Client)
    private loadPublicData() {
        const keyword = this.searchQuery().trim();
        const type = this.currentType();
        const page = this.currentPage();

        this.loading.set(true);

        if (keyword) {
            // Gọi API search public đã có trong PostService
            this.postService.searchPublicPosts(type, page, keyword)
                .pipe(finalize(() => this.loading.set(false)))
                .subscribe({
                    next: res => {
                        this._posts.set(res?.data?.posts ?? []);
                        this._allRealEstatePosts.set(res?.data?.posts ?? []); // Cập nhật danh sách bài đăng bất động sản công khai
                        this.totalPages.set(res?.pagination?.totalPages ?? 1);
                        this.totalPosts.set(res?.pagination?.totalPosts ?? 0);
                    },
                    error: (err) => {
                        this.toastService.error(err.error?.message || 'Lỗi tìm kiếm');
                        this._allRealEstatePosts.set([]); // Nếu có lỗi, xóa danh sách bài đăng bất động sản công khai
                        this._posts.set([]);
                    }
                });
        } else {
            // Nếu không có keyword, quay lại lấy danh sách public bình thường
            this.loadPublicPosts();
        }
    }





}