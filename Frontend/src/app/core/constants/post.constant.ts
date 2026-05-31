import { PropertyPermission, PropertyStatus } from "../enum/enums";

export const PROPERTY_STATUS_OPTIONS = [
  { label: PropertyStatus.DRAFT, value: PropertyStatus.DRAFT },
  { label: PropertyStatus.PENDING_APPROVAL, value: PropertyStatus.PENDING_APPROVAL },
  { label: PropertyStatus.REJECTED, value: PropertyStatus.REJECTED },
  { label: PropertyStatus.PUBLISHED, value: PropertyStatus.PUBLISHED },
  { label: PropertyStatus.PRIVATE, value: PropertyStatus.PRIVATE },
];

export const PROPERTY_STATUS_SORT_OPTIONS = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: PropertyStatus.DRAFT, value: PropertyStatus.DRAFT },
  { label: PropertyStatus.PENDING_APPROVAL, value: PropertyStatus.PENDING_APPROVAL },
  { label: PropertyStatus.REJECTED, value: PropertyStatus.REJECTED },
  { label: PropertyStatus.PUBLISHED, value: PropertyStatus.PUBLISHED },
  { label: PropertyStatus.PRIVATE, value: PropertyStatus.PRIVATE },
];

export const PROPERTY_PERMISSION_OPTIONS = [
  { label: PropertyPermission.VIEW, value: PropertyPermission.VIEW },
  { label: PropertyPermission.EDIT, value: PropertyPermission.EDIT },
];