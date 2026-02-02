import { useEffect, useRef } from "react";

export default function FeedbackOverlay({ feedbackItems, persona, onRespondInChat }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [feedbackItems]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        right: 20,
        width: 300,
        maxHeight: 450,
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(10px)",
        borderRadius: 12,
        border: "1px solid #E5E5E5",
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}
    >
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}
      >
        {feedbackItems.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#9CA3AF",
              fontSize: 12
            }}
          >
            Waiting for feedback...
          </div>
        ) : (
          feedbackItems.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                background: "#FFFFFF",
                border: "1px solid #E5E5E5",
                borderRadius: 10,
                padding: "10px 12px",
                animation: "bubbleIn 0.4s ease-out",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              {/* Persona header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 8
                }}
              >
                {persona?.avatar && (
                  <img
                    src={persona.avatar}
                    alt={persona.name}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                )}
                <div style={{ fontSize: 10, fontWeight: 600, color: "#7963D0" }}>
                  {item.slideNumber ? `Slide ${item.slideNumber}` : "Review"}
                </div>
                <div style={{ fontSize: 9, color: "#9CA3AF", marginLeft: "auto" }}>
                  +{item.timestamp}s
                </div>
              </div>
              
              {/* ONE SENTENCE ONLY */}
              <div style={{ 
                fontSize: 13, 
                color: "#181818", 
                lineHeight: 1.6, 
                marginBottom: 10,
                fontWeight: 400
              }}>
                {item.feedback || "Reviewing slide..."}
              </div>

              {/* Respond in Chat button */}
              {onRespondInChat && (
                <button
                  onClick={() => onRespondInChat(item)}
                  style={{
                    width: "100%",
                    padding: "6px 10px",
                    background: "#F5F3FF",
                    border: "1px solid #D4C5F0",
                    borderRadius: 6,
                    color: "#7963D0",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 4
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#7963D0";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F5F3FF";
                    e.currentTarget.style.color = "#7963D0";
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Respond in chat
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes bubbleIn {
          from { 
            opacity: 0; 
            transform: translateY(8px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </div>
  );
}
