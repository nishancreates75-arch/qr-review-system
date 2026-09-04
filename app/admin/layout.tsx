"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "▦",
  },
  {
    name: "Businesses",
    href: "/admin/businesses",
    icon: "▤",
  },
  {
    name: "Add Business",
    href: "/admin/add-business",
    icon: "+",
  },
  {
    name: "QR Manager",
    href: "/admin/qr",
    icon: "QR",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: "◈",
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#09090f] text-white">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-[#0d0d15] lg:block">
        <div className="flex h-full flex-col p-5">
          {/* Logo */}
          <Link href="/admin" className="mb-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 font-bold text-white">
              QR
            </div>

            <div>
              <h1 className="font-bold tracking-tight">
                QR Review
              </h1>

              <p className="text-xs text-white/40">
                Admin System
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="space-y-2">
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.25em] text-white/30">
              MAIN MENU
            </p>

            {navigation.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                      : "text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center text-xs">
                    {item.icon}
                  </span>

                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom status */}
          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />

              <div>
                <p className="text-xs font-semibold">
                  System Online
                </p>

                <p className="mt-1 text-[11px] text-white/40">
                  QR Review System Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#09090f]/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold">
              QR
            </div>

            <span className="font-bold">
              QR Review
            </span>
          </Link>

          <span className="text-xs text-green-400">
            ● Online
          </span>
        </div>

        {/* Mobile Navigation */}
        <div className="flex gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
          {navigation.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-white/50"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen lg:pl-64">
        {children}
      </main>
    </div>
  );
}