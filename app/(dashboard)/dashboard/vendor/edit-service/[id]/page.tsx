"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

type Service = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  categoryId: string;
  imageUrl: string | null;
};

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);

    fetch(`/api/vendor/services/${serviceId}`)
      .then((res) => res.json())
      .then(setService);
  }, [serviceId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price") as string),
      categoryId: formData.get("categoryId"),
      imageUrl: formData.get("imageUrl") || null,
    };

    const res = await fetch(`/api/vendor/services/${serviceId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard/vendor?updated=true");
    } else {
      alert("Failed to update service");
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const res = await fetch(`/api/vendor/services/${serviceId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.push("/dashboard/vendor?deleted=true");
    } else {
      alert("Failed to delete service");
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-black">
        Loading...
      </div>
    );
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
          <h1 className="text-2xl font-bold mb-6 text-black">Edit Service</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Service Title
              </label>
              <input
                name="title"
                type="text"
                required
                defaultValue={service.title}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                defaultValue={service.description || ""}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Price ($)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                required
                min="0"
                defaultValue={service.price}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Category
              </label>
              <select
                name="categoryId"
                required
                defaultValue={service.categoryId}
                className="w-full px-4 py-2 border rounded text-black"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-black">
                Image URL (optional)
              </label>
              <input
                name="imageUrl"
                type="url"
                defaultValue={service.imageUrl || ""}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Updating..." : "Update Service"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
