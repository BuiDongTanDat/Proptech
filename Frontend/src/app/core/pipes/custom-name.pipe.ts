import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customName',
})
export class CustomNamePipe implements PipeTransform {
  transform(name: string | undefined | null): string {
    if (!name || !name.trim()) {
      return '??';
    }

    const parts = name.trim().split(/\s+/); // Tách tên bằng khoảng trắng (xử lý cả nhiều khoảng trắng)

    if (parts.length === 0) return '??';

    // Trường hợp chỉ có 1 từ (ví dụ: "Dat") -> Lấy 2 chữ cái đầu "DA"
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    // Trường hợp nhiều từ (ví dụ: "Bui Dong Tan Dat") -> Lấy chữ cái đầu của từ đầu và từ cuối "BD"
    const firstInitial = parts[0][0];
    const lastInitial = parts[parts.length - 1][0];

    return (firstInitial + lastInitial).toUpperCase();
  }
}