export interface Property {
  id: number;
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
}

 // ===== PROPERTIES DATA =====
  export const propertiesList: Property[] = [
    {
      id: 1,
      title: 'The Obsidian Point',
      price: '12,450,000',
      location: 'San Torini, Greece',
      suites: 4,
      baths: 6,
      sqft: 8400,
      architect: 'Studio Mirei',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80',
      badge: 'New Acquisition',
      typologies: ['Modernist'],
    },
    {
      id: 2,
      title: 'Luminal Sanctuary',
      price: '8,900,000',
      location: 'Aspen, Colorado',
      suites: 4,
      baths: 5,
      sqft: 5200,
      architect: 'Hecker',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
      typologies: ['Minimalist'],
    },
    {
      id: 3,
      title: 'The Gilded Horizon',
      price: '18,200,000',
      location: 'Palm Springs, CA',
      suites: 7,
      baths: 9,
      sqft: 12000,
      architect: 'Desert Form',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      badge: 'Featured',
      typologies: ['Modernist', 'Minimalist'],
    },
    {
      id: 4,
      title: 'Ether Heights',
      price: '6,150,000',
      location: 'Tokyo, Japan',
      suites: 3,
      baths: 3,
      sqft: 3500,
      architect: 'Kenzo & Assoc.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
      typologies: ['Industrial', 'Minimalist'],
    },
    {
      id: 5,
      title: 'The Obsidian Point',
      price: '12,450,000',
      location: 'San Torini, Greece',
      suites: 4,
      baths: 6,
      sqft: 8400,
      architect: 'Studio Mirei',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80',
      badge: 'New Acquisition',
      typologies: ['Modernist'],
    },
    {
      id: 6,
      title: 'Luminal Sanctuary',
      price: '8,900,000',
      location: 'Aspen, Colorado',
      suites: 4,
      baths: 5,
      sqft: 5200,
      architect: 'Hecker',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
      typologies: ['Minimalist'],
    },
    {
      id: 7,
      title: 'The Gilded Horizon',
      price: '18,200,000',
      location: 'Palm Springs, CA',
      suites: 7,
      baths: 9,
      sqft: 12000,
      architect: 'Desert Form',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      badge: 'Featured',
      typologies: ['Modernist', 'Minimalist'],
    },
    {
      id: 8,
      title: 'Ether Heights',
      price: '6,150,000',
      location: 'Tokyo, Japan',
      suites: 3,
      baths: 3,
      sqft: 3500,
      architect: 'Kenzo & Assoc.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
      typologies: ['Industrial', 'Minimalist'],
    },
  ];

 // ===== ACCOUNT USER DATA =====
  export interface UserAccount {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: 'admin' | 'staff';
  avatar?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}
export const usersList: UserAccount[] = [
  {
    id: 1,
    fullName: 'Nguyễn Minh Quân',
    email: 'quan.admin@realestate.vn',
    phone: '0901234567',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/300?img=1',
    status: 'active',
    createdAt: '2026-01-10',
  },
  {
    id: 2,
    fullName: 'Trần Hoàng Nam',
    email: 'nam.staff@realestate.vn',
    phone: '0912345678',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=2',
    status: 'active',
    createdAt: '2026-02-18',
  },
  {
    id: 3,
    fullName: 'Lê Thu Hà',
    email: 'ha.staff@realestate.vn',
    phone: '0987654321',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=3',
    status: 'inactive',
    createdAt: '2026-03-02',
  },
  {
    id: 4,
    fullName: 'Phạm Quốc Bảo',
    email: 'bao.admin@realestate.vn',
    phone: '0934567890',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/300?img=4',
    status: 'active',
    createdAt: '2026-03-15',
  },
  {
    id: 5,
    fullName: 'Đặng Ngọc Linh',
    email: 'linh.staff@realestate.vn',
    phone: '0978123456',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=5',
    status: 'active',
    createdAt: '2026-04-01',
  },
  {
    id: 6,
    fullName: 'Võ Thành Đạt',
    email: 'dat.staff@realestate.vn',
    phone: '0945678123',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=6',
    status: 'inactive',
    createdAt: '2026-04-08',
  },
  {
    id: 7,
    fullName: 'Ngô Gia Huy',
    email: 'huy.admin@realestate.vn',
    phone: '0961237894',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/300?img=7',
    status: 'active',
    createdAt: '2026-04-15',
  },
  {
    id: 8,
    fullName: 'Bùi Khánh Vy',
    email: 'vy.staff@realestate.vn',
    phone: '0923456789',
    role: 'staff',
    avatar: 'https://i.pravatar.cc/300?img=8',
    status: 'active',
    createdAt: '2026-04-20',
  },
];


 // ===== CONTACT DATA =====
export interface ContactForm {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'closed';
}

export const contactFormsList: ContactForm[] = [
  {
    id: 1,
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@gmail.com',
    phone: '0901234567',
    message: 'Tôi muốn tìm hiểu thêm về dự án căn hộ tại Quận 2.',
    createdAt: '2026-05-01 09:15',
    status: 'new',
  },
  {
    id: 2,
    fullName: 'Trần Thị Mai',
    email: 'mai.tran@gmail.com',
    phone: '0912345678',
    message: 'Cho tôi xin bảng giá và chính sách thanh toán mới nhất.',
    createdAt: '2026-05-01 14:20',
    status: 'contacted',
  },
  {
    id: 3,
    fullName: 'Lê Quốc Huy',
    email: 'huy.le@gmail.com',
    phone: '0987654321',
    message: 'Tôi muốn đặt lịch tham quan nhà mẫu vào cuối tuần.',
    createdAt: '2026-05-02 10:45',
    status: 'new',
  },
  {
    id: 4,
    fullName: 'Phạm Minh Đức',
    email: 'duc.pham@gmail.com',
    phone: '0934567890',
    message: 'Dự án có hỗ trợ vay ngân hàng không?',
    createdAt: '2026-05-02 16:05',
    status: 'closed',
  },
  {
    id: 5,
    fullName: 'Đặng Thu Hà',
    email: 'ha.dang@gmail.com',
    phone: '0978123456',
    message: 'Tôi cần tư vấn căn hộ 2 phòng ngủ giá dưới 3 tỷ.',
    createdAt: '2026-05-03 08:30',
    status: 'contacted',
  },
  {
    id: 6,
    fullName: 'Võ Thành Nam',
    email: 'nam.vo@gmail.com',
    phone: '0945678123',
    message: 'Xin gửi thêm thông tin về tiến độ xây dựng dự án.',
    createdAt: '2026-05-03 13:10',
    status: 'new',
  },
  {
    id: 7,
    fullName: 'Bùi Ngọc Linh',
    email: 'linh.bui@gmail.com',
    phone: '0923456789',
    message: 'Tôi muốn đăng ký nhận thông tin mở bán sớm.',
    createdAt: '2026-05-04 11:25',
    status: 'new',
  },
  {
    id: 8,
    fullName: 'Ngô Gia Bảo',
    email: 'bao.ngo@gmail.com',
    phone: '0961237894',
    message: 'Cho tôi hỏi phí quản lý hàng tháng là bao nhiêu?',
    createdAt: '2026-05-04 17:40',
    status: 'closed',
  },
];