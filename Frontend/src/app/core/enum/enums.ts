export enum UserRole {
  MANAGER = 'Quản lý',
  STAFF = 'Nhân viên',
  INTERN = 'Thực tập sinh',
}

export enum AccountStatus {
  ACTIVE = 'Kích hoạt',
  INACTIVE = 'Ngưng hoạt động',
  PENDING = 'Chờ xác thực',
}

export enum ContactStatus {
  NEW = 'Mới',
  CONTACTED = 'Đã liên hệ',
  PROCESSED = 'Đã xử lý',
  CANCELED = 'Đã hủy',
}

//Post status
export enum PropertyStatus {
  DRAFT = 'Bản nháp',
  PENDING = 'Chờ duyệt',
  PRIVATE = 'Riêng tư',
  PUBLIC = 'Công khai',
}

export enum PropertyPermission {
  VIEW = 'Xem',
  EDIT = 'Chỉnh sửa',
}