import type { CSSProperties } from "react";

type CloudProps = {
  className?: string;
  scale?: number;
  style?: CSSProperties;
};

function Cloud({ className = "", scale = 1, style }: CloudProps) {
  return (
    <div
      className={`pointer-events-none absolute ${className}`}
      style={style}
    >
      <div style={{ transform: `scale(${scale})` }}>
        <div className="relative h-6 w-24">
          <div className="absolute bottom-0 left-0 h-4 w-24 rounded-full bg-white/95" />
          <div className="absolute bottom-1 left-3 h-9 w-9 rounded-full bg-white/95" />
          <div className="absolute bottom-1 left-9 h-12 w-12 rounded-full bg-white/95" />
          <div className="absolute bottom-1 left-[72px] h-8 w-8 rounded-full bg-white/95" />
          <div className="absolute bottom-3 left-0 h-3 w-28 rounded-full bg-white/80" />
        </div>
      </div>
    </div>
  );
}

export function SunAndClouds() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-7 top-6 h-16 w-16 rounded-full bg-yellow-200/85 shadow-[0_0_70px_14px_rgba(254,240,138,0.55)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-white/30 blur-3xl" />
      <Cloud className="left-3 top-10 animate-drift" scale={0.9} style={{ animationDelay: "0s" }} />
      <Cloud className="left-28 top-28 animate-drift" scale={0.55} style={{ animationDelay: "-3s" }} />
      <Cloud className="right-6 top-16 animate-drift" scale={0.7} style={{ animationDelay: "-1.5s" }} />
      <Cloud className="left-6 top-44 animate-drift" scale={0.5} style={{ animationDelay: "-5s" }} />
      <Cloud className="right-10 top-56 animate-drift" scale={0.45} style={{ animationDelay: "-6.5s" }} />
    </div>
  );
}
