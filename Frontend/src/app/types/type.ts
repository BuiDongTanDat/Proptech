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
    id?: number;
    fullName: string;
    email: string;
    phone: string;
    role: 'admin' | 'staff';
    avatar?: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

export interface IContactForm {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

