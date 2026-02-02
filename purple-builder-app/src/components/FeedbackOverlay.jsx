import { useEffect, useRef } from "react";

export default function FeedbackOverlay({ feedbackItems, persona }) {
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
        width: 320,
        maxHeight: 400,
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
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #E5E5E5",
          background: "#F5F3FF",
          display: "flex",
          alignItems: "center",
          gap: 8
        }}
      >
        {persona?.avatar && (
          <img
            src={persona.avatar}
            alt={persona.name}
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              objectFit: "cover"
            }}
          />
        )}
        <div style={{ fontSize: 12, fontWeight: 600, color: "#181818" }}>
          {persona?.name}'s Feedback
        </div>
      </div>

      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: 12
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
              key={idx}
              style={{
                background: "#FCFCFC",
                border: "1px solid #E5E5E5",
                borderRadius: 8,
                padding: "12px",
                animation: "fadeIn 0.3s ease-in"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: "#7963D0" }}>
                  {item.section || "Section"}
                </div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>
                  +{item.timestamp}s
                </div>
              </div>
              <div style={{ fontSize: 12, color: "#181818", lineHeight: 1.6 }}>
                {item.feedback ? (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {item.feedback.split("\n").map((line, i) => 
                      line.trim() ? (
                        <li key={i} style={{ marginBottom: 4 }}>
                          {line.trim()}
                        </li>
                      ) : null
                    )}
                  </ul>
                ) : (
                  <div style={{ color: "#9CA3AF", fontStyle: "italic" }}>
                    Reviewing...
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
