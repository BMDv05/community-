import Image from "next/image";

export function Logo({ variant = "dark", compact = false, priority = false }: { variant?: "dark" | "light"; compact?: boolean; priority?: boolean }) {
  const isLightArtwork = variant === "light";
  // Transparent palette-matched artwork, auto-adapted to the surface:
  // white artwork for dark surfaces, deep-teal (#12393a) artwork for light surfaces.
  const width = isLightArtwork ? 641 : 708;
  const height = isLightArtwork ? 204 : 298;
  const src = isLightArtwork ? "/logo-on-dark.png" : "/logo-on-light.png";
  return (
    <span className="inline-flex items-center" aria-label="Double H Community">
      <Image
        src={src}
        alt="Double H Community"
        width={width}
        height={height}
        sizes={compact ? "(max-width: 640px) 120px, 150px" : "190px"}
        className={compact ? "h-auto w-[120px] sm:w-[150px]" : "h-auto w-[190px]"}
        priority={priority}
      />
    </span>
  );
}
