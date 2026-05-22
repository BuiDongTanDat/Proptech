import { AccountStatus, ContactStatus, PropertyPermission, PropertyStatus, UserRole } from "../enum/enums";

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
    status?: AccountStatus;
}



// Định nghĩa interface cho quyền truy cập tin đăng
export interface IPropertyAccess {
    userId: string;
    permission: PropertyPermission[];
}

// Người duyệt tin đăng
export interface IPropertyApproval {
    needApproval: boolean; // tạo mới luôn true
    approvedBy?: IUserAccount;
    approvedAt?: string;
    rejectReason?: string;
}


export interface IProperty {
    id?: number;

    title: string;
    address: string;

    // Trạng thái tin đăng
    status: PropertyStatus;

    // private access
    // Nếu status là 'Riêng tư', 
    // thì sẽ có trường này để lưu thông tin ai được xem/chỉnh sửa
    shared?: IPropertyAccess[]; 
    
    htmlSource?: string;
    jsonSource?: any;

    // Schedule khi status là 'Đã lên lịch'
    publishAt?: string;

    // Người tạo bài đăng
    createdBy?: IUserAccount;

    // Người duyệt bài đăng
    approval?: IPropertyApproval;

    // Timestamp
    createdAt?: string;
    updatedAt?: string;
}

