"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  // Replace with your own search logic (filtering components, API call, etc.)
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Search Results for: "{query}"</h1>
      {query ? (
        <p>Display results matching your query here.</p>
      ) : (
        <p>Please enter a search term.</p>
      )}
    </div>
  );
}
