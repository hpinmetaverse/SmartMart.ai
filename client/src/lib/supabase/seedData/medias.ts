import { db } from "../seed";
import * as schema from "../schema";

const medias = [
  {
    id: "1",
    key: "public/bathroom-planning.jpg",
    alt: "bathroom-planning-category",
  },
  {
    id: "2",
    key: "public/kitchen-planning.jpg",
    alt: "kitchen-planning-category",
  },
  {
    id: "3",
    key: "public/living-room-planning.jpg",
    alt: "living-room-planning-category",
  },
  {
    id: "4",
    key: "public/bedroom-planning.jpg",
    alt: "bedroom-planning-category",
  },
];

export const seedMedias = async () => {
  try {
    // First clear existing medias
    await db.delete(schema.medias);

    const insertedMedia = await db
      .insert(schema.medias)
      .values(medias)
      .returning();
    console.log(`Medias added to the DB:`, insertedMedia);
    return insertedMedia;
  } catch (err) {
    console.error("Error happened while inserting Media:", err);
    throw err;
  }
};
