# 🏠 Proptech - Fullstack Real Estate Management Platform

Proptech là nền tảng web fullstack hỗ trợ quản lý và đăng tải bất động sản dành cho công ty môi giới.  
Dự án được phát triển theo kiến trúc **Microservices** cho backend và **SPA** cho frontend, giúp dễ mở rộng, bảo trì và triển khai.

---

## 🔗 Demo

- Frontend (Vercel): **[https://ahpmfrontend.vercel.app](https://ahpmfrontend.vercel.app/)**

## 📌 Tính năng chính

- Đăng nhập / refresh token
- Quản lý tài khoản người dùng (Nhân viên).
- Quản lý bài đăng (Tin tức, Tin Bất động sản, Tin tuyển dụng).
- Quản lý danh mục bài đăng
- Quản lý yêu cầu tư vấn (contact)
- API documentation bằng Swagger
- Hỗ trợ chạy môi trường local bằng Docker

---

## 🧱 Kiến trúc hệ thống

### Backend (Microservices - NestJS)

- **API Gateway**: điểm vào duy nhất cho client
- **Auth Service**: xác thực, phân quyền, tài khoản
- **Posts Service**: bài đăng, danh mục, trạng thái bài đăng
- **Contact Service**: yêu cầu tư vấn từ khách hàng
- **Shared Contracts (`libs/contracts`)**: dùng chung DTO/interface/helper giữa services

### Frontend

- Xây dựng bằng **Angular**
- Giao tiếp với backend qua API Gateway
- Triển khai demo trên **Vercel**

---

## 🛠️ Công nghệ sử dụng

### Frontend
- Angular
- HTML/CSS/TypeScript
- Tailwind CSS

### Backend
- NestJS (TypeScript)
- MongoDB Atlas
- Docker & Docker Compose

### Dev Tools
- Postman
- MongoDB Compass
- Docker Desktop

---

## 📁 Cấu trúc thư mục (tổng thể)

```bash
Proptech/
├── Frontend/                  # Angular app
├── Backend/                   # NestJS microservices
│   ├── apps/
│   │   ├── api-gateway/
│   │   ├── auth/
│   │   ├── posts/
│   │   └── contact/
│   ├── libs/
│   │   └── contracts/
│   ├── docker-compose.yml
│   ├── Dockerfile
│   └── package.json
└── README.md
```

---

## ⚙️ Yêu cầu môi trường

- [Node.js](https://nodejs.org/) (khuyến nghị >= 18)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

---

## 🚀 Hướng dẫn chạy dự án (Local)

## 1) Clone repository

```bash
git clone https://github.com/BuiDongTanDat/Proptech.git
cd Proptech
```

## 2) Cấu hình biến môi trường

Bạn cần tạo file `.env` tương ứng cho từng service backend và frontend.

Ví dụ:
- `Backend/apps/api-gateway/.env`
- `Backend/apps/auth/.env`
- `Backend/apps/posts/.env`
- `Backend/apps/contact/.env`
- `Frontend/.env` (nếu dự án frontend có dùng)

---

## 3) Chạy Frontend và Backend bằng Docker

```bash
cd Backend
docker compose up --build -d
```

Backend sau khi chạy:
- API (cổng chính): `http://localhost:3000/api`
- Swagger: `http://localhost:3000/api/docs`

Dừng dịch vụ:
```bash
docker compose stop
```

Xóa container/network/volume:
```bash
docker compose down -v
```

---

Frontend mặc định (tuỳ config):
- `http://localhost:4200`

> Đảm bảo frontend đang trỏ đúng `API base URL` của backend local.

---

## 🧪 API Endpoints (tóm tắt)

Base URL: `http://localhost:3000/api`

### Auth
- `POST /auth/register`
- `POST /auth/setup`
- `POST /auth/resend`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/me`
- `POST /auth/logout`
- `POST /auth/request-reset-password`
- `PUT /auth/reset-password`
- `GET /auth`

### Posts
- `POST /posts/categories`
- `GET /posts/categories`
- `PUT /posts/categories/:id`
- `POST /posts`
- `PATCH /posts/:id`
- `GET /posts`
- `GET /posts/:id`
- `PATCH /posts/status/:id`

### Contact
- `POST /contact` hoặc endpoint theo gateway mapping thực tế
- `PATCH /contact/:id`
- `GET /contact`
- `GET /contact/:id`

> Lưu ý: endpoint Contact hiện README backend đang ghi `/posts`, bạn nên kiểm tra lại route thật để tránh nhầm với Posts service.

---

## 🐞 Debug Backend (Docker + VS Code)

Trong `Backend/package.json` thêm script:

```json
"docker:debug": "docker compose -f docker-compose.yml -f docker-compose.debug.yml up --build"
```

Chạy debug:

```bash
npm run docker:debug
```

Trong VS Code:
1. Mở **Run and Debug**
2. Attach vào container cần debug
3. Đặt breakpoint và chạy

---

## 🌍 Deploy

### Frontend (Vercel)
Có thể chạy riêng Backend trên Docker và truy cập Frontend qua vercel
- Demo: **[https://ahpmfrontend.vercel.app](https://ahpmfrontend.vercel.app/)**
