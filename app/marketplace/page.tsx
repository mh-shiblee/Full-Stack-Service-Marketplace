import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SortDropdown from "@/components/marketplace/SortDropdown";
import Footer from "@/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ServiceCard from "@/components/ServiceCard";
export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;
  const categorySlug = params.category;
  const sortOption = params.sort || "default";

  const services = await prisma.service.findMany({
    where: categorySlug
      ? {
          category: { slug: categorySlug },
        }
      : undefined,
    include: {
      vendor: { include: { user: { include: { userProfile: true } } } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Apply sorting (mutates the array)
  if (sortOption === "price-low") {
    services.sort((a, b) => a.price - b.price);
  } else if (sortOption === "price-high") {
    services.sort((a, b) => b.price - a.price);
  } else if (sortOption === "name-az") {
    services.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "name-za") {
    services.sort((a, b) => b.title.localeCompare(a.title));
  }

  const categories = await prisma.category.findMany();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Browse Services
        </h1>

        <div className="mb-8">
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            <Link
              href={`/marketplace${sortOption !== "default" ? `?sort=${sortOption}` : ""}`}
              className={`px-4 py-2 rounded whitespace-nowrap ${
                !categorySlug
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-900 border hover:bg-gray-100"
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/marketplace?category=${cat.slug}${sortOption !== "default" ? `&sort=${sortOption}` : ""}`}
                className={`px-4 py-2 rounded whitespace-nowrap ${
                  categorySlug === cat.slug
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900 border hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div>
            <SortDropdown />
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-800 text-lg">
              No services available in this category.
            </p>
            <Link
              href="/marketplace"
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              View all services
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-800 mb-4">
              Showing {services.length} service
              {services.length !== 1 ? "s" : ""}
              {categorySlug &&
                ` in ${categories.find((c) => c.slug === categorySlug)?.name}`}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  userRole={session?.user?.role}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
