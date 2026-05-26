import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from '../../../../environments/environment';
import { IContactForm } from '../../models/model';

export interface ContactRequest {
	fullName: string;
	email: string;
	phone: string;
	message: string;
	status?: string;
}

export interface ContactResponse {
	message: string;
	data: IContactForm[];
}

@Injectable({
	providedIn: 'root',
})
export class ContactService {
	private baseUrl = `${environment.apiUrl}${environment.endpoints.contacts}`; // Sử dụng URL từ environment
	constructor(private apiService: ApiService) {}

	getContacts() {
		return this.apiService.get<ContactResponse>('', { baseUrl: this.baseUrl });
	}

	addContact(request: ContactRequest) {
		return this.apiService.post<ContactResponse>('create', request, { baseUrl: this.baseUrl });
	}

	updateContact(id: number, request: Partial<ContactRequest>) {
		return this.apiService.put<ContactResponse>(`${id}`, request, { baseUrl: this.baseUrl });
	}

	deleteContact(id: number) {
		return this.apiService.delete<ContactResponse>(`${id}`, { baseUrl: this.baseUrl });
	}
}
