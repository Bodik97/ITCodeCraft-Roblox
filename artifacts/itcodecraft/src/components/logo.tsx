import { cn } from "@/lib/utils";
import "./logo.css";

export interface LogoProps {
  size?: "md" | "sm";
  href?: string;
  className?: string;
  variant?: "dark" | "light";
}

const brandPrimary = "ITCode";
const brandAccent = "Craft";
const brandPrefix = brandPrimary.startsWith("IT") ? "IT" : brandPrimary.slice(0, 2);
const brandBase = brandPrimary.slice(brandPrefix.length);

export function Logo({
  size = "md",
  href = "https://itcodecraft.tech/",
  className,
  variant = "dark",
}: LogoProps) {
  const isSmall = size === "sm";

  return (
    <a
      href={href}
      aria-label={`${brandPrimary}${brandAccent}`}
      className={cn(
        "ic-logo group",
        isSmall ? "ic-logo--sm" : "ic-logo--md",
        variant === "light" && "ic-logo--light",
        className,
      )}
    >
      {/* <span className="ic-mark" aria-hidden="true">
        <span className="ic-ring-outer" />
        <span className="ic-ring-mid" />
        <span className="ic-inner-square" />
        <span className="ic-core-dot" />
        <span className="ic-crosshair">
          <span className="ic-ch-line ic-ch-top" />
          <span className="ic-ch-line ic-ch-bottom" />
          <span className="ic-ch-line ic-ch-left" />
          <span className="ic-ch-line ic-ch-right" />
        </span>
      </span> */}

      <span className="ic-wordmark">
        <span className="ic-name">
          <span className="ic-name-prefix">{brandPrefix}</span>
          <span className="ic-name-base">{brandBase}</span>
          <span className="ic-name-accent">{brandAccent}</span>
        </span>
        <span className="ic-subline">IT SCHOOL · ONLINE</span>
      </span>
    </a>
  );
}
