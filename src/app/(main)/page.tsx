"use client";

import { useState } from "react";

export default function HomePage() {
  const [count, setCount] = useState(0);

  return (
    <button
      className="w-full border border-red-300 text-center text-3xl"
      onClick={() => setCount(count + 1)}
    >
      {count}
    </button>
  );
}
