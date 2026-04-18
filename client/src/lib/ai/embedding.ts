import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "../db/schema/embeddings";
import { db } from "../db";
import { store } from "../db/memory-store";

const embeddingModel = openai.embedding("text-embedding-ada-002");

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const allEmbeddings = await store.getEmbeddings();
  
  // Calculate cosine similarity manually
  const calculateCosineSimilarity = (a: number[], b: number[]) => {
    const dotProduct = a.reduce((acc, val, i) => acc + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  };

  const similarities = allEmbeddings.map(embedding => ({
    name: embedding.content,
    similarity: calculateCosineSimilarity(embedding.embedding, userQueryEmbedded)
  }));

  // Sort by similarity and get top 4
  return similarities
    .filter(item => item.similarity > 0.3)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 4);
};
