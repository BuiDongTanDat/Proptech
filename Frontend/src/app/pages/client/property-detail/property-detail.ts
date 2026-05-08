import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.css']
})
export class PropertyDetail {
  property = {
    name: 'The Obsidian Pavilion',
    price: '$18,450,000',
    location: 'Malibu, California',
    breadcrumb: ['Properties', 'California', 'Malibu'],
    stats: {
      area: '8,240 sq ft',
      beds: '5 Beds',
      baths: '6 Baths',
    },
    agentName: 'Brielle Thrace',
    agentTitle: 'Principal Broker, Pacific Estates',
    quote: '"Architecture is not about space but about time."',
    quoteAuthor: '— Juan Miquel, Senior Architect',
    description: [
      'Designed as a series of interlocking volumes, The Obsidian Pavilion toys with the materiality of glass to dissolve the otherwise visible. Every single angle has been adjusted to capture the ethereal dignity of the Pacific coast, creating a living gallery that changes its mood from dawn to dusk.',
      'The structure disappears into the hillside, using subterranean geothermal energy and collected solar electricity to produce a ecological footprint commensurate to land itself. This is not just a residence, but a landmark emblematic of modern architectural strategies.'
    ],
    amenities: [
      { icon: '◈', title: 'Infinite Edge', desc: 'A 75-meter negative edge pool merging with Pacific horizon.' },
      { icon: '◎', title: 'Climate Order', desc: 'Geothermal radiant heat and cool-air underfloor systems.' },
      { icon: '◐', title: 'Private Cinema', desc: 'Dedicated 28-seat IMAX-quality underground screening room.' },
      { icon: '⬡', title: 'Gallery Garage', desc: 'Temperature-controlled gallery space for up to 12 vehicles.' },
      { icon: '❋', title: 'Wellness Wing', desc: 'Cryotherapy, sauna circuit and salt therapy environment.' },
      { icon: '◆', title: 'Chef\'s Atelier', desc: 'Dual Molteni ranges, prep kitchen and cold storage.' },
      { icon: '⊕', title: 'AI', desc: 'AI concierge managing all home systems via neural interface.' },
      { icon: '◉', title: 'Absolute Privacy', desc: 'Biometric access and encrypted communications throughout.' }
    ],
    images: {
      main: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=900&q=80',
      top1: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&q=80',
      top2: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&q=80',
      bottom: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&q=80'
    }
  };

  isWishlisted = false;

  toggleWishlist() {
    this.isWishlisted = !this.isWishlisted;
  }
}