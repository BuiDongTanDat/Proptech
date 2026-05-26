import { Injectable, signal, computed, inject } from '@angular/core';
import { ContactService, ContactRequest } from '../services/contact/contact.service';
import { IContactForm } from '../models/model';
import { ToastService } from '../services/toast/toast.service';
import { finalize } from 'rxjs';
import { contactFormsList } from '../../shared/utils/data.mock';

@Injectable({ providedIn: 'root' })
export class ContactsStore {
	private contactService = inject(ContactService);
	private toastService = inject(ToastService);

	// State
	private _contacts = signal<IContactForm[]>(contactFormsList); //Mock
	readonly loading = signal<boolean>(false);
	
	readonly searchQuery = signal('');
	readonly selectedSort = signal('default');
	readonly currentPage = signal(1);
	readonly pageSize = signal(8);

	// Computed State
	readonly filteredContacts = computed(() => {
		let result = [...this._contacts()];
		const query = this.searchQuery().toLowerCase().trim();
		if (query) {
			result = result.filter(c =>
				c.fullName.toLowerCase().includes(query) ||
				c.email.toLowerCase().includes(query) ||
				c.phone.toLowerCase().includes(query)
			);
		}
		// Sort by status or createdAt if needed
		switch (this.selectedSort()) {
			case 'newest':
				result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				break;
			case 'oldest':
				result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
				break;
			default:
				break;
		}
		return result;
	});

	readonly totalPages = computed(() =>
		Math.ceil(this.filteredContacts().length / this.pageSize()) || 1
	);

	readonly paginatedContacts = computed(() => {
		const start = (this.currentPage() - 1) * this.pageSize();
		return this.filteredContacts().slice(start, start + this.pageSize());
	});

	// Actions
	loadContacts() {
		// this.loading.set(true);
		// this.contactService.getContacts()
		// 	.pipe(finalize(() => this.loading.set(false)))
		// 	.subscribe({
		// 		next: res => this._contacts.set(res.data),
		// 		error: err => this.toastService.error(err?.message || 'Lỗi tải danh sách liên hệ')
		// 	});
	}

	addContact(payload: ContactRequest) {
		// this.loading.set(true);
		// this.contactService.addContact(payload)
		// 	.pipe(finalize(() => this.loading.set(false)))
		// 	.subscribe({
		// 		next: (res: any) => {
		// 			const newContact: IContactForm = {
		// 				...res.data,
		// 				status: 'Mới',
		// 			};
		// 			this._contacts.update(list => [...list, newContact]);
		// 			this.toastService.success('Thêm liên hệ thành công');
		// 		},
		// 		error: err => this.toastService.error(err?.message || 'Lỗi thêm liên hệ')
		// 	});
	}

	updateContact(updated: IContactForm) {
		// Giả sử có API update, ở đây update local state
		this._contacts.update(list => list.map(c => c.id === updated.id ? updated : c));
		this.toastService.success('Cập nhật liên hệ thành công');
	}

	removeContact(id: number) {
		this._contacts.update(list => list.filter(c => c.id !== id));
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
