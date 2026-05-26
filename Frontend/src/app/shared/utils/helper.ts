import { AccountStatus, ContactStatus, PropertyStatus, UserRole } from "../../core/enum/enums";

// Contact status
const CONTACT_STATUS_CLASS: Record<ContactStatus, string> = {
    [ContactStatus.NEW]: 'bg-blue-100 text-blue-600',
    [ContactStatus.CONTACTED]: 'bg-yellow-100 text-yellow-600',
    [ContactStatus.PROCESSED]: 'bg-green-100 text-green-600',
    [ContactStatus.CANCELED]: 'bg-red-100 text-red-600',
};

export function getContactStatusClass(status: ContactStatus): string {
    return CONTACT_STATUS_CLASS[status] ?? 'bg-gray-100 text-gray-500';
}

// Property/Post status
const POST_STATUS_CLASS: Record<PropertyStatus, string> = {
    [PropertyStatus.DRAFT]: 'bg-gray-100 text-gray-600',
    [PropertyStatus.PENDING]: 'bg-yellow-100 text-yellow-600',
    [PropertyStatus.PRIVATE]: 'bg-purple-100 text-purple-600',
    [PropertyStatus.PUBLIC]: 'bg-green-100 text-green-600',
};

export function getPostStatusClass(status: PropertyStatus): string {
    return POST_STATUS_CLASS[status] ?? 'bg-gray-100 text-gray-500';
}

// User role
const ROLE_CLASS: Record<UserRole, string> = {
    [UserRole.MANAGER]: 'bg-orange-100 text-orange-600',
    [UserRole.STAFF]: 'bg-blue-100 text-blue-600',
    [UserRole.INTERN]: 'bg-cyan-100 text-cyan-600',
};

export function getRoleClass(role: UserRole): string {
    return ROLE_CLASS[role] ?? 'bg-gray-100 text-gray-500';
}

// Account status text color
const ACCOUNT_STATUS_CLASS: Record<AccountStatus, string> = {
    [AccountStatus.ACTIVE]: 'text-green-600',
    [AccountStatus.PENDING]: 'text-yellow-600',
    [AccountStatus.INACTIVE]: 'text-red-600',
};

export function getAccountStatusClass(status: AccountStatus): string {
    return ACCOUNT_STATUS_CLASS[status] ?? 'text-gray-500';
}

// Account status background
const ACCOUNT_STATUS_BG_CLASS: Record<AccountStatus, string> = {
    [AccountStatus.ACTIVE]: 'bg-green-600',
    [AccountStatus.PENDING]: 'bg-yellow-600',
    [AccountStatus.INACTIVE]: 'bg-red-600',
};

export function getAccountStatusBgClass(status: AccountStatus): string {
    return ACCOUNT_STATUS_BG_CLASS[status] ?? 'bg-gray-100';
}