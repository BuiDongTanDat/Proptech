import { 
  ChangeDetectionStrategy, 
  Component, 
  inject, 
  OnDestroy, 
  OnInit, 
  signal, 
  ElementRef, 
  afterNextRender 
} from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router'; // Import RouterLink để chuyển trang
import { LucideDynamicIcon } from "@lucide/angular";
import { Button } from '../../../shared/components/ui/button/button';
import { PostStore } from '../../../core/stores/post.store';

@Component({
  selector: 'app-landing-page',
  imports: [Button, LucideDynamicIcon, NgClass, NgOptimizedImage, RouterLink], // Đã thêm RouterLink
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage implements OnInit, OnDestroy {
  protected store = inject(PostStore);
  private elementRef = inject(ElementRef);
  protected readonly partnerLogoUrl =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4Rb5o-Dh1qgT56rGSMhGXyVhZnRs2mJLc6g&s';

  heroImages = [
    'landing_image/vinhome.jpg',
    'landing_image/haivanbay.jpg',
    'landing_image/maia.jpg',
    'landing_image/maia_2.jpg',
    'landing_image/masterise.jpg',
  ];

  currentSlide = signal<number>(0);
  currentProjectIndex = signal<number>(0);

  protected readonly stats = [
    { value: '100', label: 'Dự án đang hợp tác' },
    { value: '12+', label: 'Chủ đầu tư bất động sản lớn' },
    { value: '9+', label: 'Ngân hàng và tổ chức tài chính' },
  ] as const;

  protected readonly coreValues = [
    { number: '01', title: 'Kết nối', description: 'Liên kết khách hàng, đối tác và hệ sinh thái.' },
    { number: '02', title: 'Đổi mới', description: 'Không ngừng ứng dụng công nghệ mới.' },
    { number: '03', title: 'Hiệu quả', description: 'Tối ưu giá trị cho khách hàng và doanh nghiệp.' },
    { number: '04', title: 'Minh bạch', description: 'Xây dựng niềm tin bằng sự rõ ràng và chuyên nghiệp.' },
    { number: '05', title: 'Đồng hành', description: 'Phát triển bền vững cùng đối tác và khách hàng.' },
  ] as const;

  protected readonly businessModelSteps = [
    {
      text: 'Tài chính: giải pháp vay & thanh toán',
      className:
        'w-full md:w-[78%] md:ml-40 bg-white border-l-[5px] border-[#f38d31] rounded-2xl p-[14px_18px] min-h-[60px] flex items-center text-base font-bold text-[#0a8383] shadow-[0_10px_24px_rgba(0,0,0,0.05)] hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] transition-all duration-[300ms]',
    },
    {
      text: 'Công nghệ: dữ liệu & nền tảng số',
      className:
        'w-full md:w-[78%] md:ml-20 bg-white border-l-[5px] border-[#f38d31] rounded-2xl p-[14px_18px] min-h-[60px] flex items-center text-base font-bold text-[#0a8383] shadow-[0_10px_24px_rgba(0,0,0,0.05)] hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] transition-all duration-[300ms]',
    },
    {
      text: 'Bất động sản: nguồn cung & phân phối',
      className:
        'w-full md:w-[78%] md:ml-0 bg-white border-l-[5px] border-[#f38d31] rounded-2xl p-[14px_18px] min-h-[60px] flex items-center text-base font-bold text-[#0a8383] shadow-[0_10px_24px_rgba(0,0,0,0.05)] hover:-translate-y-[3px] hover:shadow-[0_16px_32px_rgba(0,0,0,0.08)] transition-all duration-[300ms]',
    },
  ] as const;

  protected readonly teamCards = [
    {
      title: 'Khối Kinh doanh & Phát triển thị trường',
      percent: '55%',
      wrapperClass: 'bg-gradient-to-br from-[#0a8383] to-[#12abab] text-white',
      circleClass: 'bg-white/15',
      descriptionClass: 'text-lg font-bold opacity-95',
      percentClass: '',
    },
    {
      title: 'Khối Công nghệ & Sản phẩm',
      percent: '30%',
      wrapperClass: 'bg-white text-[#0a8383]',
      circleClass: 'bg-black/5',
      descriptionClass: 'text-lg font-bold opacity-95 text-[#444]',
      percentClass: 'text-[#0a8383]',
    },
    {
      title: 'Khối Marketing & Truyền thông',
      percent: '10%',
      wrapperClass: 'bg-white text-[#0a8383]',
      circleClass: 'bg-black/5',
      descriptionClass: 'text-lg font-bold opacity-95 text-[#444]',
      percentClass: 'text-[#0a8383]',
    },
    {
      title: 'Khối Vận hành & Hành chính',
      percent: '5%',
      wrapperClass: 'bg-gradient-to-br from-[#f38d31] to-[#ffb76b] text-white',
      circleClass: 'bg-white/15',
      descriptionClass: 'text-lg font-bold opacity-95',
      percentClass: '',
    },
  ] as const;

  protected readonly realEstatePartners = ['Vinhomes', 'Nam Long', 'Khang Điền', 'Phú Mỹ Hưng', 'MIK Group', 'SonKim Land'];
  protected readonly bankingPartners = ['BIDV', 'Vietcombank', 'VietinBank', 'VPBank'];
  protected readonly techPartners = [
    'Công ty Cổ phần Nhà Ann Home (Annhome)',
    'CRM Express',
    'Bankexpress.vn',
  ];
  protected readonly digitalPartners = ['SSMedia', '8Trip'];

  private slideInterval?: ReturnType<typeof setInterval>;
  private observer?: IntersectionObserver;

  constructor() {
    afterNextRender(() => {
      this.initScrollReveal();
    });
  }

  ngOnInit(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide.update((prev) => (prev + 1) % this.heroImages.length);
    }, 4000);

    this.store.loadAllRealEstatePosts();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private initScrollReveal(): void {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px 0px -10% 0px', 
      threshold: 0.05,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, observerOptions);

    const elements = this.elementRef.nativeElement.querySelectorAll('.scroll-reveal');
    elements.forEach((el: Element) => {
      this.observer?.observe(el);
    });
  }

  nextProject(): void {
    const total = this.store.allRealEstatePosts().length;
    if (total <= 3) return;
    this.currentProjectIndex.update((prev) => (prev + 1) % total);
  }

  prevProject(): void {
    const total = this.store.allRealEstatePosts().length;
    if (total <= 3) return;
    this.currentProjectIndex.update((prev) => (prev - 1 + total) % total);
  }
}