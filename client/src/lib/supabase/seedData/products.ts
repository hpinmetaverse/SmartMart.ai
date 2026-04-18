import { db } from "../seed";
import * as schema from "../schema";
import type { InsertProducts } from "../schema";

const products: Partial<InsertProducts>[] = [
  {
    id: "1",
    name: "Product 1",
    slug: "product-1",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    featured: true,
    badge: "new_product",
    rating: "4",
    tags: [],
    images: [],
    featuredImageId: "1",
    collectionId: "1",
    stock: 20,
    price: "99.99",
    totalComments: 0,
  },
  {
    id: "2",
    name: "Product 2",
    slug: "product-2",
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    rating: "3.5",
    featured: true,
    featuredImageId: "2",
    collectionId: "2",
    badge: "featured",
    stock: 32,
    tags: [],
    images: [],
    price: "149.99",
    totalComments: 0,
  },
  {
    id: "3",
    name: "Product 3",
    slug: "product-3",
    featured: true,
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    rating: "5",
    featuredImageId: "3",
    collectionId: "1",
    stock: 30,
    tags: [],
    images: [],
    price: "199.99",
    totalComments: 0,
  },
  {
    id: "4",
    name: "Product 4",
    slug: "product-4",
    featured: true,
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    rating: "2",
    featuredImageId: "4",
    collectionId: "2",
    badge: "best_sale",
    stock: 1,
    tags: [],
    images: [],
    price: "79.99",
    totalComments: 0,
  },
  {
    id: "5",
    name: "Product 5",
    slug: "product-5",
    featured: true,
    description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
    rating: "5",
    featuredImageId: "1",
    collectionId: "1",
    badge: "best_sale",
    stock: 0,
    tags: [],
    images: [],
    price: "129.99",
    totalComments: 0,
  },
];

export const seedProducts = async () => {
  try {
    // First clear existing products
    await db.delete(schema.products);

    const insertedProducts = await db
      .insert(schema.products)
      .values(products)
      .returning();

    console.log(`Products added to the DB:`, insertedProducts);
    return insertedProducts;
  } catch (err) {
    console.error("Error happened while inserting products:", err);
    throw err;
  }
};
