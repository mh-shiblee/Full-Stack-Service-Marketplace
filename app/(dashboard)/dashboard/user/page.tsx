import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Footer from "@/components/Footer";

export default async function UserDashboard({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const params = await searchParams;
  const showSuccess = params.success === "true";

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <h1 className="text-xl font-bold text-gray-900">User Dashboard</h1>
          </div>
          <Link href="/api/auth/signout" className="text-red-600">
            Logout
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4">
            ✅ Payment successful! Your order has been placed.
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black">
            Welcome, {session.user.name || session.user.email}!
          </h2>
          <div className="flex gap-4">
            <Link
              href="/marketplace"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Browse Services
            </Link>
            <Link
              href="/dashboard/user/profile"
              className="bg-white text-black border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
            >
              Edit Profile
            </Link>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-900">My Orders</h3>
          {orders.length === 0 ? (
            <p className="text-gray-800">
              No orders yet. Start browsing services!
            </p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border p-4 rounded">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.service.title}
                      </p>
                      <p className="text-sm text-gray-800">
                        Order #{order.orderNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ${order.totalAmount}
                      </p>
                      <span
                        className={`text-sm px-2 py-1 rounded ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
