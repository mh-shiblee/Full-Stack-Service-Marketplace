"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

export default function CreateServicePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      categoryId: formData.get("categoryId"),
      imageUrl: formData.get("imageUrl") || null,
    };

    const res = await fetch("/api/vendor/create-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      setError("Failed to create service");
      setLoading(false);
      return;
    }

    router.push("/dashboard/vendor");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/dashboard/vendor" className="text-blue-600">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-black">
            Create New Service
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Service Title
              </label>
              <input
                name="title"
                type="text"
                required
                placeholder="e.g., Professional Home Cleaning"
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                placeholder="Describe your service..."
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Price ($)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Category
              </label>
              <select
                name="categoryId"
                required
                className="w-full px-4 py-2 border rounded text-black"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Image URL (optional)
              </label>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Service"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
