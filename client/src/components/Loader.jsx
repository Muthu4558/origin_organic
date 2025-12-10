// Loader.jsx
import React from "react";

const PRIMARY = "#2f8f4e";    
const SECONDARY = "#7ad78b"; 

const Leaf = ({ rotateDeg, delay, size = 18 }) => {
  const transform = `rotate(${rotateDeg}deg) translate(0, -52px) rotate(${ -rotateDeg }deg)`;
  return (
    <g
      transform={transform}
      style={{
        transformOrigin: "64px 64px",
        animation: `leafPulse 1400ms ease-in-out ${delay}ms infinite`,
      }}
    >
      <path
        d="M6 2 C14 -4 18 6 6 18 C-6 6 -2 4 6 2 Z"
        fill={PRIMARY}
        opacity="0.98"
        transform={`translate(${64 - size / 2}, ${64 - size / 2}) scale(${size / 18})`}
      />
    </g>
  );
};

const LeafRingLoader = ({ size = 140 }) => {
  // create 8 leaves evenly spaced
  const leafCount = 8;
  const leaves = Array.from({ length: leafCount }, (_, i) => {
    const deg = (360 / leafCount) * i;
    const delay = (i * 120) % 1400;
    return <Leaf key={i} rotateDeg={deg} delay={delay} />;
  });

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Origin Organic"
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.76)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        padding: 12,
        pointerEvents: "none",
      }}
    >
      {/* Inline keyframes + small css reset for reduced-motion */}
      <style>{`
      pointerEvents: "none",
        width: 64,
        height: 64,
        borderRadius: "9999px",
        border: "6px solid rgba(47,143,78,0.24)",
        borderTopColor: "#2f8f4e",
        animation: "spin 1s linear infinite",
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes leafPulse {
          0% { transform: scale(0.88) translateY(0); opacity: 0.85; }
          50% { transform: scale(1.06) translateY(-4px); opacity: 1; }
          100% { transform: scale(0.88) translateY(0); opacity: 0.85; }
        }
        @media (prefers-reduced-motion: reduce) {
          .lr-ring { animation: none !important; }
          g { animation: none !important; }
        }
      `}</style>

      <div style={{ textAlign: "center" }}>
        <svg
          className="lr-ring"
          width={size}
          height={size}
          viewBox="0 0 128 128"
          style={{
            display: "block",
            margin: "0 auto",
            filter: "drop-shadow(0 8px 20px rgba(47,143,78,0.12))",
            animation: "ringRotate 6s linear infinite",
          }}
          aria-hidden="true"
        >
          {/* soft halo */}
          <defs>
            <radialGradient id="gA" cx="30%" cy="20%">
              <stop offset="0%" stopColor={SECONDARY} stopOpacity="0.25" />
              <stop offset="70%" stopColor={PRIMARY} stopOpacity="0.06" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="64" cy="64" r="42" fill="url(#gA)" />

          {/* subtle ring outline */}
          <circle
            cx="64"
            cy="64"
            r="50"
            fill="none"
            stroke={PRIMARY}
            strokeOpacity="0.12"
            strokeWidth="4"
          />

          {/* center seed */}
          <circle
            cx="64"
            cy="64"
            r="18"
            fill={`url(#gA)`}
            style={{
              stroke: PRIMARY,
              strokeOpacity: 0.06,
              strokeWidth: 2,
              transformOrigin: "64px 64px",
            }}
          />

          {/* leaves (rendered via React map) */}
          {leaves}
        </svg>

        {/* Brand text + subtle bar */}
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#2a2a2a" }}>
            Origin Organic ......
          </div>
          <div
            style={{
              height: 6,
              width: 84,
              margin: "8px auto 0",
              borderRadius: 999,
              background: `linear-gradient(90deg, ${SECONDARY}, ${PRIMARY})`,
              boxShadow: "0 6px 18px rgba(47,143,78,0.12)",
              opacity: 0.95,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LeafRingLoader;