"use client";

import { Bungee } from "next/font/google";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import {
  RocketLaunchIcon,
  ChartBarIcon,
  InformationCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import Link from "next/link";

const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
});

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSmallScreenNavBarShown, SetIsSmallScreenNavBarShown] = useState(false);

  const handleUserToggleSmallScreenNavBar = () =>
    SetIsSmallScreenNavBarShown(!isSmallScreenNavBarShown);

  const navItems: {
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    href: string;
    label: string;
  }[] = [
    { Icon: RocketLaunchIcon, href: "/", label: "Chơi Fill In The Gap" },
    { Icon: ChartBarIcon, href: "/leaderboard", label: "Bảng xếp hạng" },
    { Icon: InformationCircleIcon, href: "/about", label: "Giới thiệu" },
    { Icon: UserIcon, href: "/profile", label: "Profile" },
  ];

  return (
    <>
      <header
        className={`${bungee.className} fixed top-0 z-40 flex w-screen border-b-2 border-dashed border-b-gray-600`}
      >
        <div
          className="grid place-content-center border-r-2 border-dashed border-r-gray-600 px-3 sm:hidden"
          onClick={handleUserToggleSmallScreenNavBar}
        >
          <Bars3Icon className="size-6" />
        </div>
        <div className="grow py-2 text-center text-4xl sm:pl-16">Fill In The Gap</div>
      </header>

      <nav className="fixed top-0 z-30 mt-14 hidden h-screen flex-col border-r-2 border-dashed border-r-gray-600 bg-gray-950 pb-14 max-[365px]:mt-24 sm:flex">
        {navItems.map(({ Icon, href, label }) => (
          <Link
            href={href}
            className="group relative cursor-pointer border-b-2 border-dashed border-b-gray-700 p-4 hover:bg-gray-800"
            key={href}
          >
            <Icon className="size-8" />
            <span className="absolute top-1/2 left-full hidden w-max translate-x-3 -translate-y-1/2 border-2 border-dashed border-gray-600 bg-gray-900 px-3 py-1 group-hover:block">
              {label}
            </span>
          </Link>
        ))}
      </nav>

      <main className="mt-14 max-[365px]:mt-24 sm:ml-16">{children}</main>

      {/* Small Screen NavBar */}
      {isSmallScreenNavBarShown && (
        <nav className="fixed inset-0 z-50 bg-gray-950">
          <div
            className={`${bungee.className} z-50 flex w-screen border-b-2 border-dashed border-b-gray-600`}
          >
            <div className="grow py-2 text-center text-4xl">Fill In The Gap</div>
            <div
              className="grid place-content-center border-l-2 border-dashed border-l-gray-600 px-3 sm:hidden"
              onClick={handleUserToggleSmallScreenNavBar}
            >
              <XMarkIcon className="size-6" />
            </div>
          </div>
          <div className="flex flex-col gap-6 pt-6 pl-4">
            {navItems.map(({ Icon, href, label }) => (
              <Link
                href={href}
                className="flex gap-4"
                onClick={handleUserToggleSmallScreenNavBar}
                key={href}
              >
                <Icon className="size-6" />
                <span className="text-xl font-bold">{label}</span>
              </Link>
            ))}
          </div>
        </nav>
      )}
    </>
  );
}
