"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AskAiButton } from "@/components/chat/ask-ai-button";
import { AIImageTagging } from "@/components/chat/ai_field";

interface TestResult {
  resourceCount: number;
  embeddingCount: number;
  sampleResources: Array<{ content: string }>;
  similarContent: Array<{ name: string; similarity: number }>;
}

export default function TestPage() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const response = await fetch("/api/seed", { method: "POST" });
      const result = await response.json();
      alert(result.message);
    } catch (err) {
      alert("Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch(`/api/test?query=${encodeURIComponent(query)}`);
      const result = await response.json();
      setData(result);
    } catch (err) {
      alert("Failed to fetch results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
          {/* Header */}
          <div className="px-4 py-5 border-b border-gray-200 dark:border-gray-700 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              Semantic Search Testing
            </h3>
          </div>

          {/* Seed Button */}
          <div className="px-4 py-5 sm:px-6">
            <Button
              onClick={handleSeed}
              disabled={seeding}
              className="w-full sm:w-auto"
            >
              {seeding ? "Seeding..." : "Seed Test Data"}
            </Button>
          </div>
         <AskAiButton/>

          {/* Search Form */}
          <div className="px-4 py-5 sm:px-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter your search query..."
                  className="flex-1"
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>
          </div>

          {/* Results */}
          {data && (
            <div className="px-4 py-5 sm:px-6 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Resources
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {data.resourceCount}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Embeddings
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                    {data.embeddingCount}
                  </p>
                </div>
              </div>

              {/* Similar Content */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Similar Content
                </h4>
                <div className="space-y-2">
                  {data.similarContent.map((content, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                      <p className="text-sm text-gray-900 dark:text-white">
                        {content.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Similarity: {(content.similarity * 100).toFixed(2)}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Resources */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                  Sample Resources
                </h4>
                <div className="space-y-2">
                  {data.sampleResources.map((resource, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                      <p className="text-sm text-gray-900 dark:text-white">
                        {resource.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 