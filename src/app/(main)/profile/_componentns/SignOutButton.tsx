"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  const handleUserSignOut = () => {
    signOut();
  };
  return <button onClick={handleUserSignOut}>Đăng xuất</button>;
}
