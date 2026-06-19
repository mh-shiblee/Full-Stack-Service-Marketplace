"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateUserPage() {
  const router = useRouter();
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
      role,
      businessName: formData.get("businessName"),
    };

    const res = await fetch("/api/admin/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      setError(error.message || "Failed to create user");
      setLoading(false);
      return;
    }

    router.push("/dashboard/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/dashboard/admin" className="text-blue-600">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">
            Create New User
          </h1>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 border rounded text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-900">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded text-black"
              >
                <option value="USER">User</option>
                <option value="VENDOR">Vendor</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {role === "VENDOR" && (
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900">
                  Business Name
                </label>
                <input
                  name="businessName"
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded text-black"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
