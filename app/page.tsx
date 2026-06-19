import Link from "next/link";
import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import { Clock, Users, Shield, MapPin, Mail, Phone, Home } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export default async function HomePage() {
  // Fetch 10 random services
  const session = await getServerSession(authOptions);

  const services = await prisma.service.findMany({
    take: 12,
    include: {
      vendor: true,
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <Navbar />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-black mb-6">
          Find Service Providers Near You
        </h1>
        <p className="text-xl text-black mb-12">
          Connect with trusted vendors for home cleaning, plumbing, electrical
          work, and more
        </p>

        <div className="flex justify-center gap-4">
          <Link
            href="/marketplace"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700"
          >
            Explore Services
          </Link>
          <Link
            href="/register"
            className="bg-white text-black px-8 py-3 rounded-lg text-lg border-2 border-blue-600 hover:bg-blue-50"
          >
            Get Started
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            "Home Cleaning",
            "Plumbing",
            "Electrical",
            "Painting",
            "Moving & Packing",
            "Home Decorating",
            "Carpentry",
            "Gardening",
          ].map((service) => (
            <div
              key={service}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2 text-black">
                {service}
              </h3>
              <p className="text-black">
                Professional services at your doorstep
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Services Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-black">Featured Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                userRole={session?.user?.role}
              />
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <Link
              href="/marketplace"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              See All →
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                Verified Vendors
              </h3>
              <p className="text-black">
                All service providers are background checked and verified
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                Expert Professionals
              </h3>
              <p className="text-black">
                Experienced professionals with proven track records
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                24/7 Support
              </h3>
              <p className="text-black">
                Round the clock customer support for your convenience
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                Home Service
              </h3>
              <p className="text-black">
                Services delivered right to your doorstep
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-black mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                Browse Services
              </h3>
              <p className="text-black">
                Explore our wide range of home services from verified vendors
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                Book & Pay
              </h3>
              <p className="text-black">
                Select your service, choose a time slot, and make secure payment
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                Relax & Enjoy
              </h3>
              <p className="text-black">
                Our professionals arrive at your doorstep and complete the job
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Marketplace</h3>
              <p className="text-gray-400 mb-4">
                Your trusted platform for finding quality home service
                providers.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaFacebook size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaTwitter size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaInstagram size={24} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/marketplace"
                    className="text-gray-400 hover:text-white"
                  >
                    Browse Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/register"
                    className="text-gray-400 hover:text-white"
                  >
                    Become a Vendor
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Home Cleaning
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Plumbing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Electrical Work
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Moving & Packing
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-gray-400">
                  <MapPin size={18} />
                  <span>123 Market St, New York, NY 10001</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Phone size={18} />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center gap-2 text-gray-400">
                  <Mail size={18} />
                  <span>support@marketplace.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; 2024 Marketplace. All rights reserved. |{" "}
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="#" className="hover:text-white">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
