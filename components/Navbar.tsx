"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Marketplace
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/marketplace"
            className="text-gray-600 hover:text-blue-600"
          >
            Browse Services
          </Link>

          {status === "loading" ? (
            <div className="text-gray-400">Loading...</div>
          ) : session ? (
            <>
              <Link
                href={
                  session.user.role === "ADMIN"
                    ? "/dashboard/admin"
                    : session.user.role === "VENDOR"
                      ? "/dashboard/vendor"
                      : "/dashboard/user"
                }
                className="text-gray-600 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {session.user.name || session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
