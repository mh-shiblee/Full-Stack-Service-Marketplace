"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "default";
  const currentCategory = searchParams.get("category");

  const handleSort = (value: string) => {
    const params = new URLSearchParams();

    if (currentCategory) {
      params.set("category", currentCategory);
    }

    if (value !== "default") {
      params.set("sort", value);
    }

    router.push(`/marketplace?${params.toString()}`);
  };

  return (
    <select
      value={currentSort}
      onChange={(e) => handleSort(e.target.value)}
      className="px-4 py-2 border rounded bg-white text-gray-900 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="default">Sort By</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
      <option value="name-az">Name: A-Z</option>
      <option value="name-za">Name: Z-A</option>
    </select>
  );
}
