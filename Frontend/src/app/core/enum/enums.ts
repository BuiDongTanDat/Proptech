export enum UserRole {
  MANAGER = 'Quản lý',
  STAFF = 'Nhân viên',
  INTERN = 'Thực tập sinh',
}

export enum DateSort {
  DEFAULT = 'default',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export enum AccountStatus {
  ACTIVE = 'Kích hoạt',
  INACTIVE = 'Ngừng hoạt động',
  PENDING = 'Chờ xác thực',
}

export enum ContactStatus {
  NEW = 'Mới',
  IN_PROGRESS = 'Đang xử lý',
  RESOLVED = 'Đã xử lý',
  SPAM = 'Tin rác',
}

//Post status
export enum PropertyStatus {
  DRAFT = 'Bản nháp',
  PENDING_APPROVAL = 'Chờ duyệt',
  REJECTED = 'Từ chối',
  PUBLISHED = 'Xuất bản',
  PRIVATE = 'Riêng tư',
}

export enum PropertyPermission {
  VIEW = 'Xem',
  EDIT = 'Chỉnh sửa',
}