import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import { seedMedias, seedCollections, seedProducts } from "./seedData";
import { exit } from "process";

// import { seedMedias } from "./seedData/medias"
// import { seedCollections } from "./seedData/collections"

dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

const queryClient = postgres(process.env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });

const seeddata = async () => {
  try {
    console.log("Cleaning up existing data...");
    // Delete in reverse order of dependencies
    await db.delete(schema.products);
    await db.delete(schema.collections);
    await db.delete(schema.medias);

    console.log("Seeding medias...");
    await seedMedias();

    console.log("Seeding collections...");
    await seedCollections();

    console.log("Seeding products...");
    await seedProducts();

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await queryClient.end();
    exit();
  }
};

seeddata();
