import { AccountStatus, UserRole } from "../enum/enums";

export const USER_ROLE_OPTIONS = [
  { label: UserRole.MANAGER, value: UserRole.MANAGER },
  { label: UserRole.STAFF, value: UserRole.STAFF },
  { label: UserRole.INTERN, value: UserRole.INTERN },
];

export const USER_STATUS_OPTIONS = [
  { label: AccountStatus.ACTIVE, value: AccountStatus.ACTIVE },
  { label: AccountStatus.INACTIVE, value: AccountStatus.INACTIVE },
  // { label: AccountStatus.PENDING, value: AccountStatus.PENDING },
];