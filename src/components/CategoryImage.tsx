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
      <div className="text-5xl sm:text-6xl select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.25)]">
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className="h-20 sm:h-24 w-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] select-none pointer-events-none"
    />
  );
}
