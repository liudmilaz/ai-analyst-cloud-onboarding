import React from "react";

interface LiniaLogoProps {
  variant?: "mark" | "horizontal" | "full";
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showSubtitle?: boolean;
}

export const LiniaLogo: React.FC<LiniaLogoProps> = ({
  variant = "horizontal",
  size = "sm",
  className = "",
  showSubtitle = true,
}) => {
  // Proportional sizing
  const dimensions = {
    xs: { iconH: 22, textClass: "text-sm", subClass: "text-[9px]" },
    sm: { iconH: 30, textClass: "text-base", subClass: "text-[10px]" },
    md: { iconH: 42, textClass: "text-xl", subClass: "text-xs" },
    lg: { iconH: 64, textClass: "text-3xl", subClass: "text-sm" },
  }[size];

  // The distinctive LINIA Vector Icon (Horizontal data pipeline splitting around a circular node with a 3-tier database)
  const IconMark = ({ height = 30 }: { height?: number }) => (
    <svg
      viewBox="0 0 260 110"
      height={height}
      className="overflow-visible flex-shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Antigravity Blue-ish Gradient for Pipeline Ring */}
        <linearGradient id="liniaBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>

        {/* Database Silver/Slate with Cyan glow */}
        <linearGradient id="liniaDbGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>

      {/* Pipeline Left Line */}
      <line
        x1="12"
        y1="55"
        x2="78"
        y2="55"
        stroke="url(#liniaBlueGrad)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Split & Circular Node Loop - Upper Arc */}
      <path
        d="M 74 55 C 92 55, 96 18, 130 18 C 164 18, 168 55, 186 55"
        stroke="url(#liniaBlueGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Split & Circular Node Loop - Lower Arc */}
      <path
        d="M 74 55 C 92 55, 96 92, 130 92 C 164 92, 168 55, 186 55"
        stroke="url(#liniaBlueGrad)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Pipeline Right Line */}
      <line
        x1="182"
        y1="55"
        x2="248"
        y2="55"
        stroke="url(#liniaBlueGrad)"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Database Node Cylinder (3 Tiers) inside circle */}
      {/* Tier 1 - Top Disk */}
      <ellipse
        cx="130"
        cy="40"
        rx="18"
        ry="7"
        stroke="url(#liniaDbGrad)"
        strokeWidth="3.5"
        fill="#0B132B"
        fillOpacity="0.8"
      />

      {/* Tier 2 - Middle Section */}
      <path
        d="M 112 40 L 112 55 C 112 60 120 63 130 63 C 140 63 148 60 148 55 L 148 40"
        stroke="url(#liniaDbGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Tier 3 - Bottom Section */}
      <path
        d="M 112 55 L 112 70 C 112 75 120 78 130 78 C 140 78 148 75 148 70 L 148 55"
        stroke="url(#liniaDbGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  if (variant === "mark") {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <IconMark height={dimensions.iconH} />
      </div>
    );
  }

  if (variant === "full") {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <IconMark height={dimensions.iconH * 1.5} />
        <div className="mt-2.5">
          <div
            className={`font-black tracking-[0.22em] text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-sky-300 font-sans ${dimensions.textClass}`}
            style={{ letterSpacing: "0.25em" }}
          >
            LINIA
          </div>
          {showSubtitle && (
            <div className={`font-semibold tracking-wide text-sky-400/90 mt-0.5 ${dimensions.subClass}`}>
              Human-Led & AI-Powered
            </div>
          )}
        </div>
      </div>
    );
  }

  // Horizontal variant (default for Navbar / Header home button)
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <IconMark height={dimensions.iconH} />
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-black tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-sky-200 font-sans ${dimensions.textClass}`}
        >
          LINIA
        </span>
        {showSubtitle && (
          <span className={`font-medium tracking-normal text-sky-400/80 mt-1 hidden sm:inline-block ${dimensions.subClass}`}>
            Human-Led & AI-Powered
          </span>
        )}
      </div>
    </div>
  );
};
