import { 
  AccountStatus, 
  ContactStatus, 
  PropertyStatus, 
  UserRole } from "../enum/enums";

export interface IContactForm {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: ContactStatus;
}

export interface IUserAccount {
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
}

// Ảnh tn đăng
export interface IPostImage {
  _id?: string;
  url: string;
  publicId: string;
}

// Bài đăng
export interface IPost {
  _id?: string;
  title: string;
  cover_picture: IPostImage;

  developer: string;
  location: string;
  region: string;

  status: PropertyStatus;

  htmlSource: string;
  jsonSource: string;
  
  createdAt?: string;
  updatedAt?: string;

  __v?: number;
}