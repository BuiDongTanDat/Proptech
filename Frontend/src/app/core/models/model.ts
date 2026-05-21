import { AccountStatus, ContactStatus, UserRole } from "../enum/enums";

export interface IProperty {
    id?: number;
    title: string;
    price: string;
    location: string;
    suites: number;
    baths: number;
    sqft: number;
    architect: string;
    image: string;
    badge?: string;
    typologies: string[];
    htmlSource?: string;
    jsonSource?: any;
}

export interface IUserAccount {
    _id?: string;
    name: string;
    email: string;
    role: UserRole;
    status?: AccountStatus;
}

export interface IContactForm {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: ContactStatus;
}

