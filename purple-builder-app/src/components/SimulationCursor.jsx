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
        transform: "translate(-50%, -50%)",
        zIndex: 1000,
        pointerEvents: "none",
        transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        animation: isSpeaking ? "cursor-float 2s ease-in-out infinite" : "none"
      }}
    >
      {/* Pulsing ring */}
      {isSpeaking && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 60,
            height: 60,
            borderRadius: "50%",
            border: `2px solid rgba(121, 99, 208, ${0.4 - pulse * 0.1})`,
            animation: "cursor-pulse 1.5s ease-out infinite",
            pointerEvents: "none"
          }}
        />
      )}
      
      {/* Cursor bubble */}
      <div
        style={{
          background: "#fff",
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(121, 99, 208, 0.3), 0 2px 4px rgba(0,0,0,0.1)",
          border: "2px solid #D4C5F0",
          position: "relative"
        }}
      >
        {persona?.avatar ? (
          <img
            src={persona.avatar}
            alt={persona.name}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#7963D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600
            }}
          >
            {persona?.name?.[0] || "?"}
          </div>
        )}
      </div>

      {/* Label */}
      <div
        style={{
          position: "absolute",
          top: "100%",
          left: "50%",
          transform: "translateX(-50%)",
          marginTop: 8,
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
        {isSpeaking ? "Reviewing..." : "Thinking..."}
      </div>

      <style>{`
        @keyframes cursor-float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-4px); }
        }
        @keyframes cursor-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
