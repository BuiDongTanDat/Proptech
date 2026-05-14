//Interface các loại block
export type BlockType = 'cover' | 'text' | 'image' | 'columns';
export type ColumnContentType = 'text' | 'image';
export type ColumnImageFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

// Block cột
export interface ColumnItem {
  id: string;
  contentType: ColumnContentType;
  title?: string;
  content?: string;
  imageUrl?: string;
  widthRatio?: number;         // % chiều rộng, luôn tổng = 100
  imageFit?: ColumnImageFit;
  imageWidth?: number;         // % width của ảnh bên trong box (10–100)
  imageBoxHeight?: number;     // px chiều cao của box chứa ảnh
}

// Block hiển thị ô chọn loại block
export interface BlockLibraryItem {
  type: BlockType;
  name: string;
  icon?: string; // có thể thêm icon cho mỗi loại block
  desc?: string; // mô tả ngắn gọn về block
}

// Block chính hiển thị trên page
// Mỗi block sẽ 
export interface PageBlock {
  id: string;
  type: BlockType;
  name: string;
  data: {
    // Cover + Text dùng title
    title?: string;
    // Cover
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: string;
    titleFontSize?: number;
    subtitleFontSize?: number;
    // Text + Image
    content?: string;
    imageUrl?: string;
    // Columns
    columns?: ColumnItem[];
  };
}