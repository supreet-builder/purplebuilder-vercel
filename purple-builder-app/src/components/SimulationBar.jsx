export default function SimulationBar({ 
  persona, 
  elapsedSeconds, 
  status, 
  onStop, 
  onPause, 
  isPaused 
}) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid #E5E5E5",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 100
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {persona?.avatar && (
          <img
            src={persona.avatar}
            alt={persona.name}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #D4C5F0"
            }}
          />
        )}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#181818" }}>
            Simulating with {persona?.name || "AI"}
          </div>
          <div style={{ fontSize: 11, color: "#6B6B6B", marginTop: 2 }}>
            {status || "Scanning..."}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: "#7963D0",
            fontFamily: "monospace",
            minWidth: 50,
            textAlign: "right"
          }}
        >
          {formatTime(elapsedSeconds)}
        </div>

        {onPause && (
          <button
            onClick={onPause}
            style={{
              padding: "6px 14px",
              background: isPaused ? "#7963D0" : "transparent",
              border: "1.5px solid #7963D0",
              borderRadius: 8,
              color: isPaused ? "#fff" : "#7963D0",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              if (!isPaused) {
                e.currentTarget.style.background = "#F5F3FF";
              }
            }}
            onMouseLeave={(e) => {
              if (!isPaused) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {isPaused ? "▶ Resume" : "⏸ Pause"}
          </button>
        )}

        <button
          onClick={onStop}
          style={{
            padding: "6px 14px",
            background: "#DC2626",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#B91C1C";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#DC2626";
          }}
        >
          ⏹ Stop
        </button>
      </div>
    </div>
  );
}
