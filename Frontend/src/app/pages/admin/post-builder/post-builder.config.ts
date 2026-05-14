import {
  BlockLibraryItem,
  BlockType,
  ColumnContentType,
  ColumnItem,
  PageBlock,
} from './post-builder.type';

export const BLOCK_LIBRARY: ReadonlyArray<BlockLibraryItem> = [
  { type: 'cover',   name: 'Cover'  , icon: 'wallpaper' , desc: 'Giới thiệu với hình nền, tiêu đề, mô tả và nút kêu gọi hành động.' },
  { type: 'text',    name: 'Text'   , icon: 'type' , desc: 'Đoạn văn bản với tiêu đề và nội dung mô tả.' },
  { type: 'image',   name: 'Image'  , icon: 'image' , desc: 'Hình ảnh trang trí hoặc minh họa.' },
  { type: 'columns', name: 'Columns', icon: 'columns-3' , desc: 'Bố cục chia cột linh hoạt, mỗi cột có thể là text hoặc image.' },
];

// Hàm tạo id mới ngẫu nhiên
function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// Hàm tạo block
export function createBlock(type: BlockType): PageBlock {
  const id = generateId('block');

  if (type === 'cover') {
    return {
      id, type: 'cover', name: 'Cover',
      data: {
        title: 'Tiêu đề',
        subtitle: 'Nhập nội dung giới thiệu tại đây.',
        buttonText: 'Nhận tư vấn',
        buttonLink: '#',
        backgroundImage: '',
        titleFontSize: 40,
        subtitleFontSize: 20,
      },
    };
  }

  if (type === 'text') {
    return {
      id, type: 'text', name: 'Text',
      data: {
        title: 'Tiêu đề',
        content: 'Nhập nội dung giới thiệu tại đây.',
      },
    };
  }

  if (type === 'columns') {
    return {
      id, type: 'columns', name: 'Columns',
      data: {
        columns: [
          createColumn('text', 'Cột nội dung 1'),
          createColumn('image'),
        ],
      },
    };
  }

  // default: image
  return {
    id, type: 'image', name: 'Image',
    data: { imageUrl: '' },
  };
}

export function createColumn(
  type: ColumnContentType,
  title = 'Tiêu đề cột'
): ColumnItem {
  return {
    id: generateId('column'),
    contentType: type,
    widthRatio: 50,
    imageFit: 'contain',
    imageWidth: 100,
    imageBoxHeight: 420,
    title:   type === 'text' ? title : '',
    content: type === 'text' ? 'Nhập nội dung mô tả cho cột.' : '',
    imageUrl: '',
  };
}

export const MIN_COLUMN_WIDTH = 10;  // mỗi cột tối thiểu 10%
export const COLUMN_WIDTH_STEP = 10; // snap theo bước 10%