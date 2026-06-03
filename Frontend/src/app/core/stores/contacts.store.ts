import { Injectable, signal, computed, inject } from '@angular/core';
import { ContactService, ContactRequest } from '../services/contact.service';
import { IContact } from '../models/model';
import { ToastService } from '../services/toast.service';
import { catchError, finalize, of, tap, throwError } from 'rxjs';
import { ContactStatus, DateSort } from '../enum/enums';
import { CONTACT_STATUS_OPTIONS } from '../constants/contact.constant';


@Injectable({ providedIn: 'root' })
export class ContactsStore {
	private contactService = inject(ContactService);
	private toastService = inject(ToastService);

	// State
	private _contacts = signal<IContact[]>([]);
	readonly contacts = this._contacts.asReadonly();


	readonly loading = signal<boolean>(false);
	readonly submitLoading = signal<boolean>(false);

	readonly searchQuery = signal('');
	readonly selectedSort = signal(DateSort.DEFAULT);
	readonly selectedStatus = signal(CONTACT_STATUS_OPTIONS[0].value); // Mặc định là 'all'

	readonly pageSize = signal(12); // Cố định 12 post mỗi trang
	readonly currentPage = signal(1);
	readonly totalPages = signal(1);

	// Computed State
	readonly filteredContacts = computed(() => {
		let result = [...this._contacts()]; // Clone trước
		const query = this.searchQuery().toLowerCase().trim();
		if (query) {
			result = result.filter(c =>
				c.name.toLowerCase().includes(query) ||
				c.phone.toLowerCase().includes(query)
			);
		}
		//Sort by status or createdAt if needed
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
			case DateSort.DEFAULT:
			default:
				break;
		}

		// Lọc theo trạng thái		
		if (this.selectedStatus() !== CONTACT_STATUS_OPTIONS[0].value) { // Nếu không phải 'all'
			result = result.filter(c => c.status === this.selectedStatus());
		}

		return result;
	});


	// Actions
	loadContacts() {
		this.loading.set(true);
		this.contactService.getAllContacts(this.currentPage())
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: (res) => {
					this._contacts.set(res.data ?? []);
					this.totalPages.set(res.pagination.totalPages);
				},
				error: err => this.toastService.error(err?.error?.message || 'Lỗi tải liên hệ')
			});
	}

	getContactById(id: string) {
		this.loading.set(true);
		return this.contactService.getContactById(id)
			.pipe(finalize(() => this.loading.set(false)));
	}

	updateContactStatus(id: string, status: ContactStatus) {
		this.loading.set(true);
		return this.contactService.updateContactStatus(id, status)
			.pipe(finalize(() => this.loading.set(false)));
	}

	addContact(payload: ContactRequest) {
		this.submitLoading.set(true);

		const apiPayload: ContactRequest = {
			name: payload.name,
			phone: payload.phone,
			message: payload.message,
			post: payload.post || undefined,
		};

		return this.contactService.addContact(apiPayload).pipe(
			tap((res: any) => {
				const newContact: IContact = res.data;
				this._contacts.update(list => [...list, newContact]);
				this.toastService.success(res.message || 'Thêm liên hệ thành công');
			}),
			catchError((err) => {
				this.toastService.error(err?.error?.message || 'Lỗi thêm liên hệ');
				return throwError(() => err);
			}),
			finalize(() => this.submitLoading.set(false))
		);
	}


	updateContact(updated: IContact) {
		this.submitLoading.set(true);
		return of(updated).pipe(
			tap((res) => {
				// Giả sử có API update, ở đây update local state
				this._contacts.update(list => list.map(c => c._id === updated._id ? updated : c));
				this.toastService.success(res.message || 'Cập nhật liên hệ thành công');
			}),
			finalize(() => this.submitLoading.set(false))
		);
	}

	removeContact(_id: string) {
		this._contacts.update(list => list.filter(c => c._id !== _id));
		this.toastService.success('Đã xóa liên hệ');
	}

	setPage(page: number) {
		this.currentPage.set(page);
	}

	// Các setter cho filter/sort/search
	setSearch(query: string) {
		this.searchQuery.set(query);
		this.currentPage.set(1);
	}

	setSort(sort: string) {
		this.selectedSort.set(sort as DateSort);
		this.currentPage.set(1);
	}

	setStatus(status: string) {
		this.selectedStatus.set(status as ContactStatus);
		this.currentPage.set(1);
	}
}
