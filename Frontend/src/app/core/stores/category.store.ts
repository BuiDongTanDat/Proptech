import { Injectable, signal, computed, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { finalize, tap } from 'rxjs';
import { CategoryService } from '../services/category.service';
import { ICategory } from '../models/model';
import { DateSort } from '../enum/enums';

@Injectable({ providedIn: 'root' })
export class CategoryStore {
    private toastService = inject(ToastService);
    private categoryService = inject(CategoryService);

    //State
    private _categories = signal<ICategory[]>([]);
    readonly categories = this._categories.asReadonly(); // Chỉ cho phép đọc từ bên ngoài

    readonly loading = signal<boolean>(false);
    readonly submitLoading = signal<boolean>(false); // add / edit

    readonly searchQuery = signal('');
    readonly selectedSort = signal(DateSort.DEFAULT)
    readonly currentPage = signal(1);
    readonly pageSize = signal(12);

    // Computed State (Tự động chạy lại khi các tín hiệu trên thay đổi)
    readonly filteredCategories = computed(() => {
        let result = [...this._categories()];
        const query = this.searchQuery().toLowerCase().trim();

        if (query) {
            result = result.filter(c =>
                c.name.toLowerCase().includes(query)
            );
        }

        switch (this.selectedSort()) {
            case DateSort.NEWEST:
                result.sort((a, b) => {
                    const dateA = new Date(a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
                    const dateB = new Date(b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
                    return dateB.getTime() - dateA.getTime();
                });
                break;
            case DateSort.OLDEST:
                result.sort((a, b) => {
                    const dateA = new Date(a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
                    const dateB = new Date(b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
                    return dateA.getTime() - dateB.getTime();
                });
                break;
        }
        return result;
    });

    readonly totalPages = computed(() => {
        return Math.ceil(this.filteredCategories().length / this.pageSize());
    });

    readonly paginatedCategories = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize();
        return this.filteredCategories().slice(start, start + this.pageSize());
    });

    loadCategories() {
        this.loading.set(true);
        return this.categoryService.getCategories().pipe(
            tap(categories => this._categories.set(categories.data)),
            finalize(() => this.loading.set(false))
        ).subscribe();
    }

    addCategory(name: string) {
        this.submitLoading.set(true);
        return this.categoryService.createCategory(name).pipe(
            tap(res => {
                const newCategory = res.data;
                this._categories.update(categories => [newCategory, ...categories]);
                this.toastService.success(res.message || 'Thêm danh mục thành công');
            }),
            finalize(() => this.submitLoading.set(false))
        );
    }

    updateCategory(id: string, name: string) {
        this.submitLoading.set(true);
        return this.categoryService.updateCategory(id, name).pipe(
            tap(res => {
                const updatedCategory = res.data;
                this._categories.update(categories =>
                    categories.map(c => c._id === id ? updatedCategory : c)
                );
                this.toastService.success(res.message || 'Cập nhật danh mục thành công');
            }),
            finalize(() => this.submitLoading.set(false))
        );
    }

    deleteCategory(id: string) {
        this.submitLoading.set(true);
        this._categories.update(categories => categories.filter(c => c._id !== id));
    }

    setPage(page: number) {
        this.currentPage.set(page);
    }

    setSearch(query: string) {
        this.searchQuery.set(query);
        this.currentPage.set(1); // Reset về trang đầu khi tìm kiếm
    }

    setSort(sort: string) {
        this.selectedSort.set(sort as DateSort);
        this.currentPage.set(1); // Reset về trang đầu khi thay đổi sắp xếp
    }

}

