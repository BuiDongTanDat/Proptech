import { Pipe, PipeTransform } from "@angular/core";

// shared/pipes/currency-vnd.pipe.ts
@Pipe({ name: 'currencyVnd', standalone: true })
export class CurrencyVndPipe implements PipeTransform {
    transform(value: number): string {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency', currency: 'VND'
        }).format(value);
    }
}

// Sử dụng trong template:
// {{ property.price | currencyVnd }}
