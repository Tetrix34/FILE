import type { Product, Category } from '../types';

interface ProductsData {
  products: Omit<Product, 'categoryName'>[];
}

interface CategoriesData {
  categories: Category[];
}

/**
 * Optimizes a Cloudinary URL by adding transformation parameters.
 * @param url The original Cloudinary image URL.
 * @param transformations A string of Cloudinary transformation parameters (e.g., 'w_400,q_auto,f_auto').
 * @returns The transformed URL.
 */
export const optimizeCloudinaryUrl = (url: string, transformations: string = 'q_auto,f_auto'): string => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
};

/**
 * Fetches and combines catalog data from local JSON files.
 * @returns A promise that resolves to an object containing products and categories.
 */
export async function getCatalogData(): Promise<{ products: Product[], categories: Category[] }> {
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch('/data/products.json'),
      fetch('/data/categories.json')
    ]);

    if (!productsResponse.ok) throw new Error(`HTTP error! status: ${productsResponse.status}`);
    if (!categoriesResponse.ok) throw new Error(`HTTP error! status: ${categoriesResponse.status}`);

    const productsData: ProductsData = await productsResponse.json();
    const categoriesData: CategoriesData = await categoriesResponse.json();
    
    if (!Array.isArray(productsData.products)) throw new Error("Formato de datos de productos no válido.");
    if (!Array.isArray(categoriesData.categories)) throw new Error("Formato de datos de categorías no válido.");

    // Create a map for quick category lookup, storing both name and icon
    const categoryMap = new Map<string, { name: string; icon?: string }>();
    categoriesData.categories.forEach(cat => {
        cat.subcategories.forEach(sub => {
            categoryMap.set(sub.id, { name: sub.name, icon: sub.icon });
        });
    });
    
    // Enrich products with category names and icons
    const enrichedProducts: Product[] = productsData.products.map(p => {
        const product = p as any; // Cast to access category id string
        const subcategoryInfo = categoryMap.get(product.category);
        return {
            ...product,
            category: subcategoryInfo?.name || 'Sin categoría',
            categoryIcon: subcategoryInfo?.icon,
        }
    });

    return { products: enrichedProducts, categories: categoriesData.categories };

  } catch (error) {
    console.error("Error al cargar los datos del catálogo local:", error);
    throw new Error("No se pudo cargar el catálogo de productos.");
  }
}