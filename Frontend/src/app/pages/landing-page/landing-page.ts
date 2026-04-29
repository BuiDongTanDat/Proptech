import { Component } from '@angular/core';
import { Button } from "../../shared/components/ui/button/button";
import { LucideDynamicIcon } from "@lucide/angular";

@Component({
  selector: 'app-landing-page',
  imports: [Button, LucideDynamicIcon],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
    hotels = [
    {
      id: 1,
      name: 'Hotel Paradise',
      location: 'Maldives',
      description: 'Experience the ultimate luxury in the heart of the Maldives. Experience the ultimate luxury in the heart of the Maldives.Experience the ultimate luxury in the heart of the Maldives.Experience the ultimate luxury in the heart of the Maldives.',
      price: 250,
      imageUrl: '/cozumel.jpg',
    },
    {
      id: 2,
      name: 'Ocean View Resort',
      location: 'Hawaii',
      description: 'Enjoy breathtaking ocean views and world-class amenities.',
      price: 300,
      imageUrl: '/luxury-resort.jpg',
    },
    {
      id: 3,
      name: 'Mountain Retreat',
      location: 'Switzerland',
      description: 'Escape to the serene mountains for a peaceful getaway.',
      price: 200,
      imageUrl: '/maldives.jpg',
    },
    {
      id: 4,
      name: 'City Lights Hotel',
      location: 'New York',
      description: 'Experience the vibrant city life with luxurious comfort.',
      price: 350,
      imageUrl: '/sweden.jpg',
    },
    {
      id: 5,
      name: 'Desert Oasis',
      location: 'Dubai',
      description: 'Indulge in opulence amidst the stunning desert landscape.',
      price: 400,
      imageUrl: '/sweden.jpg',
    }
  ]

}
