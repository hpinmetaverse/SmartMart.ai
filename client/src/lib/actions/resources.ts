"use server";

import { generateEmbeddings } from "../ai/embedding";
import { store } from "../db/memory-store";

// Add dummy data array
const dummyResources = [
  {
    content: "JavaScript is a programming language that is one of the core technologies of the World Wide Web. It enables interactive web pages and is an essential part of web applications.",
  },
  {
    content: "React is a free and open-source front-end JavaScript library for building user interfaces based on components.",
  },
  {
    content: "Next.js is a React framework that enables several extra features, including server-side rendering and generating static websites.",
  },
  {
    content: "TypeScript is a programming language developed and maintained by Microsoft. It is a strict syntactical superset of JavaScript and adds optional static typing.",
  }
];

export const seedResources = async () => {
  try {
    // Clear existing data
    await store.clear();

    for (const resource of dummyResources) {
      // Add resource
      const newResource = await store.addResource(resource.content);

      // Generate and store embeddings
      const embeddings = await generateEmbeddings(resource.content);
      for (const embedding of embeddings) {
        await store.addEmbedding(
          newResource.id,
          embedding.content,
          embedding.embedding
        );
      }
    }
    return "Successfully seeded resources with dummy data.";
  } catch (error) {
    return error instanceof Error ? error.message : "Error seeding resources.";
  }
};

export const createResource = async (content: string) => {
  try {
    const resource = await store.addResource(content);
    const embeddings = await generateEmbeddings(content);
    
    for (const embedding of embeddings) {
      await store.addEmbedding(
        resource.id,
        embedding.content,
        embedding.embedding
      );
    }
    return "Resource successfully created and embedded.";
  } catch (error) {
    return error instanceof Error ? error.message : "Error creating resource.";
  }
};
