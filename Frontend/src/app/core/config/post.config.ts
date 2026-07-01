
import { Validators } from '@angular/forms';
export type PostType = 'news' | 'properties' | 'jobs';
export type FieldType = 'input' | 'textarea' | 'dropdown' | 'image' | 'date';

export interface DynamicFieldConfig {
  key: string;
  label: string;
  type: FieldType;

  placeholder?: string;
  required?: boolean;

  listVisible?: boolean;
  previewVisible?: boolean;

  options?: { label: string; value: string }[];
}

export const REGION_OPTIONS = [
  { label: 'Miền Bắc', value: 'Miền Bắc' },
  { label: 'Miền Trung', value: 'Miền Trung' },
  { label: 'Miền Nam', value: 'Miền Nam' },
];

export function isPostType(value: string | null): value is PostType {
  return value === 'news' || value === 'properties' || value === 'jobs';
}

export const POST_PAGE_CONFIG: Record<PostType, {
  label: string;
  description: string;
  fields: DynamicFieldConfig[];
}> = {
  news: {
    label: 'Tin tức',
    description: 'Quản lý bài viết tin tức',
    fields: [
      {
        key: 'title',
        label: 'Tiêu đề ',
        type: 'textarea',
        placeholder: 'Nhập tiêu đề ...',
        required: true,
        listVisible: true,
        previewVisible: true,
      },
      // {
      //   key: 'summary',
      //   label: 'Mô tả ngắn',
      //   type: 'textarea',
      //   placeholder: 'Nhập mô tả ngắn...',
      //   listVisible: true,
      //   previewVisible: true,
      // },
      {
        key: 'cover_picture',
        label: 'Ảnh bìa',
        type: 'image',
        previewVisible: true,
      },
    ],
  },

  properties: {
    label: 'Dự án',
    description: 'Quản lý dự án',
    fields: [
      {
        key: 'category',
        label: 'Danh mục',
        type: 'dropdown',
        options: [],
        required: true,
        listVisible: true,
        previewVisible: true,
      },
      {
        key: 'title',
        label: 'Tiêu đề dự án',
        type: 'textarea',
        placeholder: 'Nhập tiêu đề dự án...',
        required: true,
        listVisible: true,
        previewVisible: true,
      },
      {
        key: 'developer',
        label: 'Chủ đầu tư',
        type: 'input',
        placeholder: 'Nhập tên chủ đầu tư...',
        listVisible: true,
        previewVisible: true,
      },
      {
        key: 'location',
        label: 'Vị trí địa lý',
        type: 'textarea',
        placeholder: 'Nhập vị trí dự án...',
        listVisible: true,
        previewVisible: true,
      },
      {
        key: 'region',
        label: 'Khu vực vùng miền',
        type: 'dropdown',
        options: REGION_OPTIONS,
        previewVisible: true,
      },
      {
        key: 'cover_picture',
        label: 'Ảnh bìa đại diện',
        type: 'image',
        previewVisible: true,
      },
    ],
  },

  jobs: {
    label: 'Tuyển dụng',
    description: 'Quản lý tin tuyển dụng',
    fields: [
      {
        key: 'title',
        label: 'Vị trí tuyển dụng',
        type: 'textarea',
        placeholder: 'Nhập vị trí tuyển dụng...',
        required: true,
        listVisible: true,
        previewVisible: true,
      },
      {
        key: 'cover_picture',
        label: 'Ảnh bìa',
        type: 'image',
        previewVisible: true,
      },
      // {
      //   key: 'department',
      //   label: 'Phòng ban',
      //   type: 'input',
      //   placeholder: 'Nhập phòng ban...',
      //   listVisible: true,
      //   previewVisible: true,
      // },
      // {
      //   key: 'workLocation',
      //   label: 'Địa điểm làm việc',
      //   type: 'input',
      //   placeholder: 'Nhập địa điểm làm việc...',
      //   listVisible: true,
      //   previewVisible: true,
      // },
      // {
      //   key: 'salary',
      //   label: 'Mức lương',
      //   type: 'input',
      //   placeholder: 'Nhập mức lương...',
      //   previewVisible: true,
      // },
      // {
      //   key: 'deadline',
      //   label: 'Hạn nộp hồ sơ',
      //   type: 'date',
      //   previewVisible: true,
      // },
    ],
  },
};