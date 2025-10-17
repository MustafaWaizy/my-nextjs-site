"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

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

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
