export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  message: string;
  pagination?: PaginationMeta;
  data: T;
}

export interface ApiErrorResponse {
  message: string;
  error?: string;
  statusCode?: number;
  raw?: any; // Lưu nguyên response thô để debug nếu cần
}