import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Footer from "@/components/Footer";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const [users, orders, services, categories] = await Promise.all([
    prisma.user.findMany({
      include: { userProfile: true, vendorProfile: true },
    }),
    prisma.order.findMany(),
    prisma.service.findMany(),
    prisma.category.findMany(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <Link href="/api/auth/signout" className="text-red-600">
            Logout
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-black">
          Platform Overview
        </h2>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-800">Total Users</p>
            <p className="text-3xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-800">Vendors</p>
            <p className="text-3xl font-bold text-gray-800">
              {users.filter((u) => u.role === "VENDOR").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-800">Services</p>
            <p className="text-3xl font-bold text-gray-800">
              {services.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-800">Orders</p>
            <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">All Users</h3>
            <Link
              href="/dashboard/admin/create-user"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Create User
            </Link>
          </div>
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-2 text-black">Email</th>
                <th className="text-left p-2 text-black">Name</th>
                <th className="text-left p-2 text-black">Role</th>
                <th className="text-left p-2 text-black">Created</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-2 text-gray-800">{user.email}</td>
                  <td className="p-2 text-gray-800">
                    {user.userProfile?.name || "-"}
                  </td>
                  <td className="p-2 text-gray-800">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        user.role === "ADMIN"
                          ? "bg-red-100 text-red-800"
                          : user.role === "VENDOR"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-2 text-gray-800">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}
