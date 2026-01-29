"use client";
import { useState } from "react";
import { SearchIcon } from "../../assets/icons";

export const AiResearch = () => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await fetch("/api/ai-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="AI Research"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-gray-200 text-gray-800 placeholder-gray-500 rounded-full py-2 px-4 pl-10 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
      />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <button onClick={handleSearch} className="text-gray-500 hover:text-gray-800">
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};
