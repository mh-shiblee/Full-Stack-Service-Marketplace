"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Service = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  vendor?: {
    businessName: string;
  };
  category?: {
    name: string;
  };
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const serviceId = searchParams.get("serviceId");

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout?serviceId=" + serviceId);
    }

    if (serviceId) {
      fetch(`/api/services/${serviceId}`)
        .then((res) => res.json())
        .then(setService);
    }
  }, [serviceId, status, router]);

  async function handlePayment() {
    setLoading(true);

    const res = await fetch("/api/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceId }),
    });

    const data = await res.json();

    if (res.ok) {
      await fetch("/api/payment/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: data.order.id }),
      });

      router.push("/dashboard/user?success=true");
    } else {
      alert("Order failed!");
      setLoading(false);
    }
  }

  if (status === "loading" || !service) {
    return (
      <div className="grow flex items-center justify-center">
        <p className="text-gray-900">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grow py-12">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Checkout</h1>

        <div className="border-b pb-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {service.title}
          </h2>
          <p className="text-gray-800">{service.description}</p>
          <p className="text-sm text-gray-800 mt-2">
            Provider: {service.vendor?.businessName}
          </p>
          <p className="text-sm text-gray-800">
            Category: {service.category?.name}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-lg mb-2 text-gray-900">
            <span>Service Fee:</span>
            <span>${service.price}</span>
          </div>
          <div className="flex justify-between text-2xl font-bold border-t pt-2">
            <span className="text-gray-900">Total:</span>
            <span className="text-blue-600">${service.price}</span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded mb-6">
          <p className="text-sm text-yellow-800">
            🧪 <strong>Test Mode:</strong> This is a simulated payment. No real
            transaction will occur.
          </p>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Pay Now (Test)"}
        </button>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <Suspense
        fallback={
          <div className="grow flex items-center justify-center">
            <p className="text-gray-900">Loading...</p>
          </div>
        }
      >
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}
