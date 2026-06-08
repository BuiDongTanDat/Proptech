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
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router'; // Import RouterLink để chuyển trang
import { LucideDynamicIcon } from "@lucide/angular";
import { Button } from '../../../shared/components/ui/button/button';
import { PostStore } from '../../../core/stores/post.store';

@Component({
  selector: 'app-landing-page',
  imports: [Button, LucideDynamicIcon, NgOptimizedImage, RouterLink], // Đã thêm RouterLink
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage implements OnInit, OnDestroy {
  protected store = inject(PostStore);
  private elementRef = inject(ElementRef);

  heroImages = [
    'landing_image/vinhome.jpg',
    'landing_image/haivanbay.jpg',
    'landing_image/maia.jpg',
    'landing_image/maia_2.jpg',
    'landing_image/masterise.jpg',
  ];

  currentSlide = signal<number>(0);
  currentProjectIndex = signal<number>(0);

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