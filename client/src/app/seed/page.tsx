"use client"

import { seedResources } from "@/lib/actions/resources";
import { Button } from "@/components/ui/button"; // assuming you have this component
import { useState } from "react";

export default function SeedPage() {
  const [status, setStatus] = useState<string>("");

  const handleSeed = async () => {
    setStatus("Seeding...");
    const result = await seedResources();
    setStatus(result);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Button onClick={handleSeed}>Seed Resources</Button>
      {status && <p>{status}</p>}
    </div>
  );
} 