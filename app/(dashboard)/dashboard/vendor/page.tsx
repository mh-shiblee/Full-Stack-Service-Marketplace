import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Footer from "@/components/Footer";

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "VENDOR") redirect("/login");

  const vendor = await prisma.vendorProfile.findUnique({
    where: { userId: session.user.id },
    include: { services: { include: { orders: true } } },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              Home
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              Vendor Dashboard
            </h1>
          </div>
          <Link href="/api/auth/signout" className="text-red-600">
            Logout
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 grow">
        <h2 className="text-2xl font-bold mb-6 text-black">
          Welcome, {vendor?.businessName}!
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-black">Total Services</p>
            <p className="text-3xl font-bold text-black">
              {vendor?.services.length || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-black">Total Orders</p>
            <p className="text-3xl font-bold text-black">
              {vendor?.services.reduce((acc, s) => acc + s.orders.length, 0) ||
                0}
            </p>
            <Link
              href="/dashboard/vendor/orders"
              className="text-sm text-blue-600 hover:underline mt-2 inline-block"
            >
              View All Orders →
            </Link>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-black">Revenue</p>
            <p className="text-3xl font-bold text-black">
              $
              {vendor?.services
                .reduce(
                  (acc, s) =>
                    acc + s.orders.reduce((sum, o) => sum + o.totalAmount, 0),
                  0,
                )
                .toFixed(2) || 0}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-black">My Services</h3>
            <Link
              href="/dashboard/vendor/create-service"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              + Add Service
            </Link>
          </div>

          {!vendor?.services.length ? (
            <p className="text-black">
              No services yet. Create your first service!
            </p>
          ) : (
            <div className="grid gap-4">
              {vendor.services.map((service) => (
                <div
                  key={service.id}
                  className="border p-4 rounded flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-black">{service.title}</p>
                    <p className="text-sm text-black">{service.description}</p>
                    <p className="text-sm text-black mt-1">
                      {service.orders.length} orders
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-bold text-lg text-black">
                        ${service.price}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/vendor/edit-service/${service.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      Edit
                    </Link>
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
