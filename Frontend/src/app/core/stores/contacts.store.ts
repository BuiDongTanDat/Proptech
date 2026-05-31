import { Injectable, signal, computed, inject } from '@angular/core';
import { ContactService, ContactRequest } from '../services/contact.service';
import { IContact } from '../models/model';
import { ToastService } from '../services/toast.service';
import { finalize } from 'rxjs';
import { ContactStatus } from '../enum/enums';


@Injectable({ providedIn: 'root' })
export class ContactsStore {
	private contactService = inject(ContactService);
	private toastService = inject(ToastService);

	// State
	private _contacts = signal<IContact[]>([]);
	readonly contacts = this._contacts.asReadonly();


	readonly loading = signal<boolean>(false);

	readonly searchQuery = signal('');
	readonly selectedSort = signal('default');

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
		this.loading.set(true);
		// Chuẩn hóa dữ liệu gửi lên API
		const request: ContactRequest = {
			name: payload.name,
			phone: payload.phone,
			message: payload.message,
			postId: payload.postId || undefined,
		};
		this.contactService.addContact(request)
			.pipe(finalize(() => this.loading.set(false)))
			.subscribe({
				next: (res: any) => {
					const newContact: IContact = {
						...payload,
						status: ContactStatus.NEW,
					};
					this._contacts.update(list => [...list, newContact]);
					this.toastService.success('Thêm liên hệ thành công');
				},
				error: err => this.toastService.error(err?.message || 'Lỗi thêm liên hệ')
			});
	}


	updateContact(updated: IContact) {
		// Giả sử có API update, ở đây update local state
		this._contacts.update(list => list.map(c => c._id === updated._id ? updated : c));
		this.toastService.success('Cập nhật liên hệ thành công');
	}

	removeContact(_id: string) {
		this._contacts.update(list => list.filter(c => c._id !== _id));
		this.toastService.success('Đã xóa liên hệ');
	}

	setPage(page: number) {
		this.currentPage.set(page);
	}

	setSearch(query: string) {
		this.searchQuery.set(query);
		this.currentPage.set(1);
	}

	setSort(sort: string) {
		this.selectedSort.set(sort);
		this.currentPage.set(1);
	}
}
