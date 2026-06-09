import { ContactStatus } from "../enum/enums";

// Add statusOptions for dropdown
export const CONTACT_STATUS_OPTIONS = [
  { label: 'Tất cả trạng thái', value: 'all' },
  { label: ContactStatus.NEW, value: ContactStatus.NEW },
  { label: ContactStatus.IN_PROGRESS, value: ContactStatus.IN_PROGRESS },
  { label: ContactStatus.RESOLVED, value: ContactStatus.RESOLVED },
  { label: ContactStatus.SPAM, value: ContactStatus.SPAM },
  
];

export const CONTACT_STATUS_UPDATE_OPTIONS = [
  { label: ContactStatus.NEW, value: ContactStatus.NEW },
  { label: ContactStatus.IN_PROGRESS, value: ContactStatus.IN_PROGRESS },
  { label: ContactStatus.RESOLVED, value: ContactStatus.RESOLVED },
  { label: ContactStatus.SPAM, value: ContactStatus.SPAM },
  
];