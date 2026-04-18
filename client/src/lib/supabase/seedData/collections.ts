import { db } from "../seed";
import * as schema from "../schema";

const collections = [
  {
    id: "1",
    label: "Mens",
    slug: "mens",
    title: "Be like a man",
    description:
      "Explore our curated collection for men, featuring high-quality grooming essentials, stylish accessories, and timeless wardrobe staples. Discover the essence of masculine elegance and confidence.",
    featured_image_id: "1",
  },
  {
    id: "2",
    label: "Kitchen",
    title: "Elevate Your Kitchen Experience",
    slug: "kitchen-planning",
    description: "",
    featured_image_id: "2",
  },
  {
    id: "3",
    label: "Kids",
    title: "Elevate Your Kids Room Experience",
    slug: "kids-room-planning",
    description: "",
    featured_image_id: "3",
    order: 9,
  },
  {
    id: "4",
    label: "Bedroom",
    title: "Elevate Your Bedroom Experience",
    slug: "bedroom-planning",
    description: "",
    featured_image_id: "4",
  },
];

export const seedCollections = async () => {
  try {
    // First clear existing collections
    await db.delete(schema.collections);

    const insertedCollections = await db
      .insert(schema.collections)
      .values(collections)
      .returning();

    console.log(`Collections added to the DB:`, insertedCollections);
    return insertedCollections;
  } catch (err) {
    console.error("Error happened while inserting collections:", err);
    throw err;
  }
};
