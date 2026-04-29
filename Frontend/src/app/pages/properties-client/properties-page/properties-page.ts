import { Component } from '@angular/core';
import { PropertiesSidebar } from '../properties-sidebar/properties-sidebar';
import { PropertiesList } from '../properties-list/properties-list';
import { CheckTag } from '../../../shared/components/check-tag/check-tag';
import { Pagination } from '../../../shared/components/pagination/pagination';


interface Property {
  id: number;
  title: string;
  price: string;
  location: string;
  suites: number;
  baths: number;
  sqft: number;
  architect: string;
  image: string;
  badge?: string;
  typologies: string[];
}

interface Attribute {
  label: string;
  checked: boolean;
}

@Component({
  selector: 'app-properties-page',
  imports: [
    PropertiesSidebar,
    PropertiesList,
    Pagination,
    CheckTag,
  ],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
})
export class PropertiesPage {
  // ===== FILTER STATE =====
  filters = {
    location: '',
    typologies: [] as string[],
  };

  typologies = ['Modernist', 'Minimalist', 'Classical', 'Industrial'];

  coreAttributes: Attribute[] = [
    { label: 'Private Gallery', checked: false },
    { label: 'Infinity Pool', checked: true },
    { label: 'Smart Ecosystem', checked: false },
    { label: 'Wine Cellar', checked: false },
  ];

  // ===== PAGINATION =====
  currentPage = 1;
  pageSize = 6;
  get totalPages(): number {
    return Math.ceil(this.filteredPropertiesAll.length / this.pageSize) || 1;
  }

  // ===== PROPERTIES DATA =====
  properties: Property[] = [
    {
      id: 1,
      title: 'The Obsidian Point',
      price: '12,450,000',
      location: 'San Torini, Greece',
      suites: 4,
      baths: 6,
      sqft: 8400,
      architect: 'Studio Mirei',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80',
      badge: 'New Acquisition',
      typologies: ['Modernist'],
    },
    {
      id: 2,
      title: 'Luminal Sanctuary',
      price: '8,900,000',
      location: 'Aspen, Colorado',
      suites: 4,
      baths: 5,
      sqft: 5200,
      architect: 'Hecker',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
      typologies: ['Minimalist'],
    },
    {
      id: 3,
      title: 'The Gilded Horizon',
      price: '18,200,000',
      location: 'Palm Springs, CA',
      suites: 7,
      baths: 9,
      sqft: 12000,
      architect: 'Desert Form',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      badge: 'Featured',
      typologies: ['Modernist', 'Minimalist'],
    },
    {
      id: 4,
      title: 'Ether Heights',
      price: '6,150,000',
      location: 'Tokyo, Japan',
      suites: 3,
      baths: 3,
      sqft: 3500,
      architect: 'Kenzo & Assoc.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
      typologies: ['Industrial', 'Minimalist'],
    },
    {
      id: 5,
      title: 'The Obsidian Point',
      price: '12,450,000',
      location: 'San Torini, Greece',
      suites: 4,
      baths: 6,
      sqft: 8400,
      architect: 'Studio Mirei',
      image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=900&q=80',
      badge: 'New Acquisition',
      typologies: ['Modernist'],
    },
    {
      id: 6,
      title: 'Luminal Sanctuary',
      price: '8,900,000',
      location: 'Aspen, Colorado',
      suites: 4,
      baths: 5,
      sqft: 5200,
      architect: 'Hecker',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=900&q=80',
      typologies: ['Minimalist'],
    },
    {
      id: 7,
      title: 'The Gilded Horizon',
      price: '18,200,000',
      location: 'Palm Springs, CA',
      suites: 7,
      baths: 9,
      sqft: 12000,
      architect: 'Desert Form',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      badge: 'Featured',
      typologies: ['Modernist', 'Minimalist'],
    },
    {
      id: 8,
      title: 'Ether Heights',
      price: '6,150,000',
      location: 'Tokyo, Japan',
      suites: 3,
      baths: 3,
      sqft: 3500,
      architect: 'Kenzo & Assoc.',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80',
      typologies: ['Industrial', 'Minimalist'],
    },
  ];

  // ===== COMPUTED =====
  get filteredPropertiesAll(): Property[] {
    return this.properties.filter(p => {
      const locationMatch = !this.filters.location ||
        p.location.toLowerCase().includes(this.filters.location.toLowerCase());

      const typologyMatch = this.filters.typologies.length === 0 ||
        this.filters.typologies.some(t => p.typologies.includes(t));

      return locationMatch && typologyMatch;
    });
  }

  get filteredProperties(): Property[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPropertiesAll.slice(start, start + this.pageSize);
  }

  // ===== METHODS =====
  toggleTypology(type: string): void {
    const idx = this.filters.typologies.indexOf(type);
    if (idx === -1) {
      this.filters.typologies.push(type);
    } else {
      this.filters.typologies.splice(idx, 1);
    }
    this.currentPage = 1;
  }

  isTypologyActive(type: string): boolean {
    return this.filters.typologies.includes(type);
  }

  toggleAttribute(attr: Attribute): void {
    attr.checked = !attr.checked;
  }

  onPageChange(page: number) {
    this.currentPage = page;
  }
}
