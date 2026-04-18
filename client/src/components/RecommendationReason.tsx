"use client";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";
import { useState } from "react";

type RecommendationReasonProps = {
  productId: string;
  currentProductId: string;
  productName?: string;
  currentProductName?: string;
};

export default function RecommendationReason({
  productId,
  currentProductId,
  productName = "Product",
  currentProductName = "Current Product",
}: RecommendationReasonProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchRecommendationReason = async () => {
    setLoading(true);
    try {
      // Send product context to the API — real Supabase data is fetched server-side
      const response = await fetch("/api/recommendation-reason", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName,
          currentProductName,
          productId,
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let rawResult = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        rawResult += decoder.decode(value);
      }

      // Extract just the text content from the stream format
      let cleanResult = "";

      // Parse the stream data to extract just the text content
      const contentMatches = rawResult.match(/0:"([^"]*)"/g) || [];
      if (contentMatches.length > 0) {
        cleanResult = contentMatches
          .map((match) => match.substring(3, match.length - 1))
          .join("")
          .replace(/\\n/g, " "); // Replace newlines with spaces
      } else {
        // Fallback to use the raw content if parsing fails
        cleanResult = rawResult;
      }

      console.log(`Reason for ${productName} (${productId}):`, cleanResult);
      setReason(cleanResult);
    } catch (error) {
      console.error("Error fetching recommendation reason:", error);
      setReason("Based on your shopping preferences");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-1">
      {!reason ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:bg-gray-100 px-2 py-1 h-auto"
          onClick={fetchRecommendationReason}
          disabled={loading}
        >
          <InfoIcon className="h-3 w-3 mr-1" />
          <span>{loading ? "Loading..." : "Why recommended?"}</span>
        </Button>
      ) : (
        <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded-md">
          <div className="flex items-start">
            <InfoIcon className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-0.5">Why we recommended this:</p>
              <p>{reason}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}