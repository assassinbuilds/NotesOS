"use client";

import { useState } from "react";

interface CategoryImageProps {
  src: string;
  alt: string;
  fallbackEmoji: string;
}

export default function CategoryImage({ src, alt, fallbackEmoji }: CategoryImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="text-9xl filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] select-none transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:-translate-y-2">
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <div className="relative h-48 flex items-center justify-center">
      <img
        src={src}
        alt={alt}
        onError={() => setHasError(true)}
        className="h-48 w-auto object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)] select-none pointer-events-none transition-all duration-300 group-hover:scale-115 group-hover:-translate-y-3"
      />
    </div>
  );
}
