import Link from "next/link";

type ServiceCardProps = {
  service: {
    id: string;
    title: string;
    description: string | null;
    price: number;
    category: {
      name: string;
    };
    vendor: {
      businessName: string;
    };
  };
  userRole?: string | null;
};

export default function ServiceCard({ service, userRole }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition">
      <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg"></div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 text-black">{service.title}</h3>
        <p className="text-black text-sm mb-3 line-clamp-2">
          {service.description || "No description"}
        </p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-black">{service.category.name}</span>
          <span className="text-sm text-black">
            by {service.vendor.businessName}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            ${service.price}
          </span>
          {userRole === undefined ? (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Login to Book
            </Link>
          ) : userRole === "USER" ? (
            <Link
              href={`/checkout?serviceId=${service.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Book Now
            </Link>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed text-sm"
              title="Only users can book services"
            >
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
