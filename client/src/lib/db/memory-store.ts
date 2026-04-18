// Create an in-memory store
type Resource = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

type Embedding = {
  id: string;
  resourceId: string;
  content: string;
  embedding: number[];
};

class MemoryStore {
  private resources: Map<string, Resource> = new Map();
  private embeddings: Map<string, Embedding> = new Map();

  // Generate simple IDs
  private generateId = () => Math.random().toString(36).substring(2, 15);

  // Resource methods
  async addResource(content: string): Promise<Resource> {
    const id = this.generateId();
    const resource = {
      id,
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.resources.set(id, resource);
    return resource;
  }

  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  // Embedding methods
  async addEmbedding(resourceId: string, content: string, embedding: number[]): Promise<Embedding> {
    const id = this.generateId();
    const embeddingDoc = {
      id,
      resourceId,
      content,
      embedding,
    };
    this.embeddings.set(id, embeddingDoc);
    return embeddingDoc;
  }

  async getEmbeddings(): Promise<Embedding[]> {
    return Array.from(this.embeddings.values());
  }

  // Clear all data
  async clear() {
    this.resources.clear();
    this.embeddings.clear();
  }
}

export const store = new MemoryStore(); 