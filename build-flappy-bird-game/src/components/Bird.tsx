type BirdProps = {
  width?: number;
  height?: number;
  slow?: boolean;
  className?: string;
};

export function Bird({
  width = 42,
  height = 36,
  slow = false,
  className,
}: BirdProps) {
  const wing = slow ? "bird-wing bird-wing-slow" : "bird-wing";

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 96 80"
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="birdBody" cx="38%" cy="30%" r="78%">
          <stop offset="0%" stopColor="#fef9c3" />
          <stop offset="38%" stopColor="#fde047" />
          <stop offset="72%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </radialGradient>
        <linearGradient id="birdBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff7ed" />
          <stop offset="100%" stopColor="#fed7aa" />
        </linearGradient>
        <linearGradient id="birdWing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
        <linearGradient id="birdBeak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
        <linearGradient id="birdTail" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* Tail feathers */}
      <g stroke="#7c2d12" strokeWidth="2.6" strokeLinejoin="round">
        <path d="M22 24 C8 20 1 18 -3 16 C4 24 9 28 17 31 Z" fill="url(#birdTail)" />
        <path d="M20 40 C6 40 -1 40 -5 40 C3 46 9 48 18 47 Z" fill="url(#birdTail)" />
        <path d="M22 54 C9 60 3 64 -1 66 C7 62 12 58 20 53 Z" fill="url(#birdTail)" />
      </g>

      {/* Feet */}
      <g stroke="#c2410c" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M47 62 V 69 M47 69 L 44 72 M47 69 L 50 72" />
        <path d="M57 62 V 69 M57 69 L 54 72 M57 69 L 60 72" />
      </g>

      {/* Body */}
      <ellipse
        cx="50"
        cy="40"
        rx="33"
        ry="27"
        fill="url(#birdBody)"
        stroke="#7c2d12"
        strokeWidth="3.6"
      />

      {/* Belly */}
      <ellipse cx="58" cy="49" rx="20" ry="15" fill="url(#birdBelly)" />

      {/* Cheek blush */}
      <ellipse cx="64" cy="40" rx="6" ry="4" fill="#fb7185" opacity="0.5" />

      {/* Wing (animated) */}
      <g className={wing}>
        <path
          d="M29 34 C20 41 21 55 36 57 C51 58 57 47 50 38 C43 30 35 30 29 34 Z"
          fill="url(#birdWing)"
          stroke="#7c2d12"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M33 41 C29 45 30 51 36 53"
          fill="none"
          stroke="#7c2d12"
          strokeWidth="2"
          opacity="0.45"
          strokeLinecap="round"
        />
        <path
          d="M40 40 C37 44 38 50 43 52"
          fill="none"
          stroke="#7c2d12"
          strokeWidth="2"
          opacity="0.45"
          strokeLinecap="round"
        />
      </g>

      {/* Head tuft */}
      <path d="M57 15 C59 8 66 8 68 15 Z" fill="#7c2d12" />

      {/* Eye */}
      <circle cx="68" cy="26" r="9.5" fill="#ffffff" stroke="#7c2d12" strokeWidth="2.6" />
      <circle cx="70" cy="26" r="4.6" fill="#1f2937" />
      <circle cx="68.4" cy="24.2" r="1.7" fill="#ffffff" />
      <circle cx="71.4" cy="27.6" r="0.9" fill="#ffffff" />

      {/* Beak (upper + lower + mouth line) */}
      <g stroke="#7c2d12" strokeWidth="2.6" strokeLinejoin="round">
        <path d="M81 31 C95 33 98 40 85 41 L73 37 Z" fill="url(#birdBeak)" />
        <path d="M81 41 C94 43 95 49 83 50 L73 44 Z" fill="#f97316" />
        <path d="M73 41 L92 41" fill="none" stroke="#7c2d12" strokeWidth="2" />
      </g>
    </svg>
  );
}
