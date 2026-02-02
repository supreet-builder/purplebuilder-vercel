import { useEffect, useState } from "react";

export default function SimulationCursor({ 
  position, 
  persona, 
  isActive, 
  isSpeaking 
}) {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 3);
    }, 600);
    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive || !position) return null;

  const { x, y } = position;

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-12px, -12px)", // Offset for mouse pointer
        zIndex: 1000,
        pointerEvents: "none",
        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        animation: isSpeaking ? "cursor-float 2s ease-in-out infinite" : "none"
      }}
    >
      {/* Mouse pointer icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
        }}
      >
        <path
          d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
          fill="#181818"
          stroke="#fff"
          strokeWidth="1"
        />
      </svg>

      {/* Persona avatar attached to cursor */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "#fff",
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(121, 99, 208, 0.4), 0 1px 3px rgba(0,0,0,0.2)",
          border: "2px solid #D4C5F0",
          animation: isSpeaking ? "avatar-pulse 1.2s ease-in-out infinite" : "none"
        }}
      >
        {persona?.avatar ? (
          <img
            src={persona.avatar}
            alt={persona.name}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#7963D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600
            }}
          >
            {persona?.name?.[0] || "?"}
          </div>
        )}
      </div>

      {/* Pulsing ring when speaking */}
      {isSpeaking && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            transform: "translate(-50%, -50%)",
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: `2px solid rgba(121, 99, 208, ${0.5 - pulse * 0.15})`,
            animation: "cursor-pulse 1.5s ease-out infinite",
            pointerEvents: "none"
          }}
        />
      )}

      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: 4,
          background: "rgba(121, 99, 208, 0.95)",
          color: "#fff",
          padding: "4px 10px",
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 600,
          whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
        }}
      >
        {isSpeaking ? "Reviewing..." : "Reading..."}
      </div>

      <style>{`
        @keyframes cursor-float {
          0%, 100% { transform: translate(-12px, -12px) translateY(0px); }
          50% { transform: translate(-12px, -12px) translateY(-3px); }
        }
        @keyframes cursor-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
        @keyframes avatar-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
