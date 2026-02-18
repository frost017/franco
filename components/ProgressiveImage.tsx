"use client"

import Image from "next/image"
import { useState } from "react"

type Props = {
  lowSrc: string
  highSrc: string
  alt: string
  priority?: boolean
  sizes?: string
  className?: string
}

export default function ProgressiveImage({
  lowSrc,
  highSrc,
  alt,
  priority = false,
  sizes = "100vw",
  className = "object-cover",
}: Props) {
  const [hiLoaded, setHiLoaded] = useState(false)

  return (
    <div className="absolute inset-0">
      {/* LOW: always visible, no transitions, no blur, no scale */}
      <img
        src={lowSrc}
        alt={alt}
        className={["absolute inset-0 h-full w-full", className].join(" ")}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        // @ts-expect-error
        fetchpriority={priority ? "high" : "auto"}
      />

      {/* HIGH: fades in on top */}
      <Image
        src={highSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={false}
        loading={priority ? "eager" : "lazy"}
        className={[
          "absolute inset-0",
          className,
          "transition-opacity duration-500",
          hiLoaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onLoadingComplete={() => setHiLoaded(true)}
      />
    </div>
  )
}
