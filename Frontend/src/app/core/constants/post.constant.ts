import { PropertyPermission, PropertyStatus } from "../enum/enums";

export const PROPERTY_STATUS_OPTIONS = [
  { label: PropertyStatus.DRAFT, value: PropertyStatus.DRAFT },
  { label: PropertyStatus.PENDING, value: PropertyStatus.PENDING },
  { label: PropertyStatus.PRIVATE, value: PropertyStatus.PRIVATE },
  { label: PropertyStatus.PUBLIC, value: PropertyStatus.PUBLIC },
];

export const PROPERTY_PERMISSION_OPTIONS = [
  { label: PropertyPermission.VIEW, value: PropertyPermission.VIEW },
  { label: PropertyPermission.EDIT, value: PropertyPermission.EDIT },
];