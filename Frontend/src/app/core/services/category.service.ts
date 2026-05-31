import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/response';
import { ICategory } from '../models/model';

@Injectable({
    providedIn: 'root',
})
export class CategoryService {

    private categoryEndpoint = `${environment.apiUrl}${environment.endpoints.category}`;
    private http = inject(HttpClient);

    getCategories() {
        return this.http.get<ApiResponse<ICategory[]>>(`${this.categoryEndpoint}`);
    }

    createCategory(name: string) {
        return this.http.post<ApiResponse<ICategory>>(`${this.categoryEndpoint}`, { name });
    }

    updateCategory(id: string, name: string) {
        return this.http.put<ApiResponse<ICategory>>(`${this.categoryEndpoint}/${id}`, { name });
    }
    
}