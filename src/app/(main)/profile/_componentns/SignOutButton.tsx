"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const handleUserSignOut = () => {
    signOut();
  };
  return (
    <button
      className="cursor-pointer border-2 border-dashed border-red-900 px-6 py-2 hover:border-red-700"
      onClick={handleUserSignOut}
    >
      Đăng xuất
    </button>
  );
}
