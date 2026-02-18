"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

type CardSectionProps = {
  header: string
  descriptor: string
  buttonText: string
  location?: "left" | "right"

  /** High-res image */
  image: string
  /** Low-res (tiny) image shown first */
  lowImage: string

  href?: string
  aboveTheFold?: boolean
}

function ProgressiveImage({
  lowSrc,
  highSrc,
  alt,
  priority = false,
}: {
  lowSrc: string
  highSrc: string
  alt: string
  priority?: boolean
}) {
  const [hiLoaded, setHiLoaded] = useState(false)

  return (
    <div className="absolute inset-0 bg-black">
      {/* LOW: always visible base layer (fastest paint) */}
      <img
        src={lowSrc}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
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
        sizes="100vw"
        priority={false}
        loading={priority ? "eager" : "lazy"}
        className={[
          "object-cover transition-opacity duration-500",
          hiLoaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onLoadingComplete={() => setHiLoaded(true)}
      />
    </div>
  )
}

export default function CardSection({
  header,
  descriptor,
  buttonText,
  location = "left",
  image,
  lowImage,
  href = "/about",
  aboveTheFold = false,
}: CardSectionProps) {
  const desktopJustify = location === "right" ? "justify-end" : "justify-start"

  return (
    <section className="relative bg-black">
      {/* ===== Mobile ===== */}
      <div className="md:hidden">
        <div className="relative h-[240px] w-full overflow-hidden bg-black">
          <ProgressiveImage
            lowSrc={lowImage}
            highSrc={image}
            alt={header}
            priority={aboveTheFold}
          />
          <div className="absolute inset-0" />
        </div>

        <div className="w-full bg-[#111]">
          <div className="h-[6px] w-full bg-[#b00000]" />

          <div className="px-6 py-10">
            <h2 className="text-2xl font-extrabold uppercase tracking-tight text-white leading-[1.1]">
              {header}
            </h2>

            <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
              {descriptor}
            </p>

            <div className="mt-6">
              <Link
                href={href}
                className="inline-flex items-center justify-center bg-[#b00000] px-5 py-2 text-xs font-bold tracking-widest text-white hover:bg-[#8f0000]"
              >
                {buttonText}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Desktop ===== */}
      <div className="hidden md:block">
        <div className="relative min-h-[600px] overflow-hidden bg-black">
          {/* Background */}
          <div className="absolute inset-0">
            <ProgressiveImage
              lowSrc={lowImage}
              highSrc={image}
              alt={header}
              priority={aboveTheFold}
            />
            <div className="absolute inset-0" />
          </div>

          <div
            className={`relative z-10 flex min-h-[600px] items-end ${desktopJustify} px-16 pb-16`}
          >
            <div className="relative w-full max-w-md">
              <Image
                src="/card.png"
                alt="Card Frame"
                width={500}
                height={400}
                className="w-full h-auto"
                loading="lazy"
              />

              <div className="absolute inset-0 flex flex-col justify-center px-10 py-8 text-white">
                <h2 className="mt-2 text-3xl font-extrabold uppercase leading-[1.05] tracking-tight">
                  {header}
                </h2>

                <p className="mt-2 text-base leading-[1.05] md:text-lg md:leading-[1.05] text-white/90">
                  {descriptor}
                </p>

                <div className="mt-4">
                  <Link
                    href={href}
                    className="inline-flex items-center justify-center bg-[#CE050F] px-6 py-3 text-xs font-bold tracking-widest text-white hover:bg-[#E7000B]"
                  >
                    {buttonText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
