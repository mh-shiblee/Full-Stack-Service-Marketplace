import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Footer from "@/components/Footer";

export default async function VendorOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "VENDOR") redirect("/login");

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      services: {
        include: {
          orders: {
            include: {
              user: { include: { userProfile: true } },
              service: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      },
    },
  });

  const allOrders = vendor?.services.flatMap((s) => s.orders) || [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              🏠 Home
            </Link>
            <Link href="/dashboard/vendor" className="text-blue-600">
              ← Dashboard
            </Link>
            <h1 className="text-xl font-bold text-black">Orders Received</h1>
          </div>
          <Link href="/api/auth/signout" className="text-red-600">
            Logout
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6 text-black">
            All Orders ({allOrders.length})
          </h2>

          {allOrders.length === 0 ? (
            <p className="text-black">No orders received yet.</p>
          ) : (
            <div className="space-y-4">
              {allOrders.map((order) => (
                <div key={order.id} className="border p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-black">
                        {order.service.title}
                      </p>
                      <p className="text-sm text-black">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-black">
                        Customer:{" "}
                        {order.user.userProfile?.name || order.user.email}
                      </p>
                      <p className="text-sm text-black">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-black">
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
