import {
  AccountStatus,
  ContactStatus,
  PropertyStatus,
  UserRole,
} from "../enum/enums";


export interface IUserAccount {
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
}

// Danh mục bài đăng
export interface ICategory {
  _id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
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
  category?: {
    _id: string,
    name: string
  },
  createdAt?: string;
  updatedAt?: string;

  __v?: number;
}

export interface IPropertyGeneralDetails {
  _id?: string;
  title: string;
  cover_picture: IPostImage;
}
export interface IContact {
  _id?: string;
  name: string;
  phone: string;
  message: string;
  status: ContactStatus;
  createdAt?: string;
  updatedAt?: string;
  post?: IPropertyGeneralDetails
  resolvedBy?: {
    _id: string;
    name: string;
  }



}
