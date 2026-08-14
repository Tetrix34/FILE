export interface Product {
  id: number;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  category: string; // The display name of the subcategory
  categoryIcon?: string; // Icon for the category, usually an emoji
  imageUrl: string;
}

export interface Subcategory {
    id: string;
    name: string;
    icon?: string;
}

export interface Category {
    id: string;
    name: string;
    subcategories: Subcategory[];
}