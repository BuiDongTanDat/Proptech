import { ContactStatus } from "../enum/enums";

// Add statusOptions for dropdown
export const CONTACT_STATUS_OPTIONS = [
  { label: ContactStatus.NEW, value: ContactStatus.NEW },
  { label: ContactStatus.CONTACTED, value: ContactStatus.CONTACTED },
  { label: ContactStatus.PROCESSED, value: ContactStatus.PROCESSED },
  { label: ContactStatus.CANCELED, value: ContactStatus.CANCELED },
];