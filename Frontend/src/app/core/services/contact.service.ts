import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IContact, IPropertyGeneralDetails } from '../models/model';
import { ContactStatus } from '../enum/enums';
import { HttpClient } from '@angular/common/http';

export interface ContactRequest {
	name: string;
	phone: string;
	message: string;
	post?: string;
}

export interface PaginatedContactResponse {
	message: string;
	pagination: {
		page: number;
		limit: number;
		totalPages: number;
		totalMessages: number;
	};
	data: {
		contacts: IContact[];
		status: {
			[key: string]: number;
		};
	};
}

export interface ContactDetailResponse {
	message: string;
	data: IContact;
	property: IPropertyGeneralDetails;
}

@Injectable({
	providedIn: 'root',
})
export class ContactService {
	private contactEndpoint = `${environment.apiUrl}${environment.endpoints.contact}`; // Sử dụng URL từ environment
	private http = inject(HttpClient);

	getAllContacts(
		page: number = 1,
	) {
		return this.http.get<PaginatedContactResponse>(`${this.contactEndpoint}?page=${page}`);
	}

	getContactById(id: string) {
		return this.http.get<ContactDetailResponse>(`${this.contactEndpoint}/${id}`);
	}

	addContact(contactData: ContactRequest) {
		return this.http.post(`${this.contactEndpoint}`, contactData);
	}

	updateContactStatus(id: string, status: ContactStatus) {
		return this.http.patch(`${this.contactEndpoint}/${id}`, {status: status});
	}

}
