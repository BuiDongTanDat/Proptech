import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { LucideDynamicIcon } from "@lucide/angular";
import { Button } from '../../../shared/components/ui/button/button';
import { PostStore } from '../../../core/stores/post.store';
import { IPost } from '../../../core/models/model';

@Component({
  selector: 'app-landing-page',
  imports: [Button, LucideDynamicIcon],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage implements OnInit, OnDestroy {
  protected store = inject(PostStore);

  heroImages = [
    'landing_image/vinhome.jpg',
    'landing_image/haivanbay.jpg',
    'landing_image/maia.jpg',
    'landing_image/maia_2.jpg',
    'landing_image/masterise.jpg',
  ];

  currentSlide = 0;

  private slideInterval?: ReturnType<typeof setInterval>;
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide =
        (this.currentSlide + 1) % this.heroImages.length;

      this.cdr.markForCheck();
    }, 3000);

    this.store.loadAllRealEstatePosts();
  }
  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  currentProjectIndex = 0;

  nextProject(): void {
    const total = this.store.allRealEstatePosts().length;

    if (total <= 3) return;

    this.currentProjectIndex =
      (this.currentProjectIndex + 1) % total;
  }

  prevProject(): void {
    const total = this.store.allRealEstatePosts().length;

    if (total <= 3) return;

    this.currentProjectIndex =
      (this.currentProjectIndex - 1 + total) % total;
  }

}
