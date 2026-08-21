import React from "react";

export default function GreetingCard({
  name = "Tailor",
  tag = "TailorStudio",
  date = "Saturday, August 1, 2026",
  todaysOrders = 0,
  pending = 0,
  ready = 0,
}) {
  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    if (hour < 21) return "Good Evening";
    return "Good Night";
  };

  const greeting = getGreeting();

  return (
    <div className="greeting-card-wrapper" style={styles.wrapper}>
      <style>{`
        ${keyframes}
        
        /* Mobile responsive styles */
        @media screen and (max-width: 640px) {
          .greeting-card-wrapper .card-inner {
            padding: 16px 14px !important;
            border-radius: 16px !important;
          }
          
          .greeting-card-wrapper .content-wrap {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 16px !important;
          }
          
          .greeting-card-wrapper .left-wrap {
            flex-direction: row !important;
            align-items: center !important;
            gap: 12px !important;
          }
          
          .greeting-card-wrapper .avatar-wrap {
            width: 48px !important;
            height: 48px !important;
          }
          
          .greeting-card-wrapper .avatar {
            width: 48px !important;
            height: 48px !important;
            font-size: 20px !important;
            border-radius: 12px !important;
          }
          
          .greeting-card-wrapper .avatar-ring,
          .greeting-card-wrapper .avatar-ring2 {
            inset: -4px !important;
            border-radius: 14px !important;
          }
          
          .greeting-card-wrapper .title-text {
            font-size: 18px !important;
          }
          
          .greeting-card-wrapper .stats-box {
            padding: 10px 12px !important;
            border-radius: 12px !important;
            flex-wrap: wrap !important;
            justify-content: space-around !important;
            gap: 4px !important;
          }
          
          .greeting-card-wrapper .stat-col {
            padding: 0 4px !important;
          }
          
          .greeting-card-wrapper .stat-label {
            font-size: 9px !important;
            margin-bottom: 4px !important;
          }
          
          .greeting-card-wrapper .stat-value {
            font-size: 14px !important;
            padding: 2px 8px !important;
            border-radius: 8px !important;
          }
          
          .greeting-card-wrapper .stat-divider {
            height: 28px !important;
          }
          
          .greeting-card-wrapper .tag {
            font-size: 10px !important;
            padding: 2px 10px !important;
          }
          
          .greeting-card-wrapper .date-row {
            font-size: 10px !important;
            flex-wrap: wrap !important;
            gap: 3px !important;
          }
          
          .greeting-card-wrapper .date-row svg {
            width: 11px !important;
            height: 11px !important;
          }
          
          .greeting-card-wrapper .blob-blue,
          .greeting-card-wrapper .blob-violet,
          .greeting-card-wrapper .blob-pink,
          .greeting-card-wrapper .blob-teal,
          .greeting-card-wrapper .blob-amber {
            width: 120px !important;
            height: 120px !important;
          }
          
          .greeting-card-wrapper .sun-badge {
            width: 16px !important;
            height: 16px !important;
            bottom: -3px !important;
            right: -3px !important;
          }
          
          .greeting-card-wrapper .sun-badge svg {
            width: 9px !important;
            height: 9px !important;
          }
          
          .greeting-card-wrapper .shine-effect {
            width: 50% !important;
          }
        }

        @media screen and (max-width: 400px) {
          .greeting-card-wrapper .card-inner {
            padding: 12px 10px !important;
          }
          
          .greeting-card-wrapper .title-text {
            font-size: 15px !important;
          }
          
          .greeting-card-wrapper .stats-box {
            padding: 8px 6px !important;
          }
          
          .greeting-card-wrapper .stat-value {
            font-size: 12px !important;
            padding: 2px 6px !important;
          }
          
          .greeting-card-wrapper .stat-label {
            font-size: 8px !important;
          }
          
          .greeting-card-wrapper .avatar-wrap {
            width: 40px !important;
            height: 40px !important;
          }
          
          .greeting-card-wrapper .avatar {
            width: 40px !important;
            height: 40px !important;
            font-size: 16px !important;
          }
        }
      `}</style>

      <div style={styles.card} className="card-inner">
        {/* animated color blobs */}
        <div style={styles.blobBlue} className="blob-blue" />
        <div style={styles.blobViolet} className="blob-violet" />
        <div style={styles.blobPink} className="blob-pink" />
        <div style={styles.blobTeal} className="blob-teal" />
        <div style={styles.blobAmber} className="blob-amber" />
        <div style={styles.dots} />
        <div style={styles.shine} className="shine-effect" />

        {/* content */}
        <div style={styles.content} className="content-wrap">
          <div style={styles.left} className="left-wrap">
            <div style={styles.avatarWrap} className="avatar-wrap">
              <div style={styles.avatarRing} className="avatar-ring" />
              <div style={styles.avatarRing2} className="avatar-ring2" />
              <div style={styles.avatar} className="avatar">{name.charAt(0).toUpperCase()}</div>
              <div style={styles.sunBadge} className="sun-badge">
                <SunIcon />
              </div>
            </div>

            <div>
              <h1 style={styles.title} className="title-text">
                {greeting}, <span style={styles.gradientName}>{name}</span>{" "}
                <span style={styles.wave}>👋</span>
              </h1>

              <div style={styles.metaRow}>
                <span style={styles.tag} className="tag">{tag}</span>
              </div>

              <div style={styles.dateRow} className="date-row">
                <CalendarIcon />
                <span style={styles.dateText}>{date}</span>
                <span style={styles.divider}>|</span>
                <CheckIcon />
                <span style={styles.readyText}>
                  {ready} orders ready for delivery
                </span>
              </div>
            </div>
          </div>

          <div style={styles.statsBox} className="stats-box">
            <Stat
              label="Today's"
              label2="Orders"
              value={todaysOrders}
              color="#4338ca"
              bg="#e4e6ff"
            />
            <div style={styles.statDivider} className="stat-divider" />
            <Stat label="Pending" value={pending} color="#c2410c" bg="#ffe8d4" />
            <div style={styles.statDivider} className="stat-divider" />
            <Stat label="Ready" value={ready} color="#0f766e" bg="#d3f9f2" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, label2, value, color, bg }) {
  return (
    <div style={styles.statCol} className="stat-col">
      <div style={styles.statLabel} className="stat-label">
        {label}
        {label2 && (
          <>
            <br />
            {label2}
          </>
        )}
      </div>
      <div style={{ ...styles.statValue, color, background: bg }} className="stat-value">{value}</div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill="#7c3aed" />
      <g stroke="#7c3aed" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.2" y1="4.2" x2="5.6" y2="5.6" />
        <line x1="18.4" y1="18.4" x2="19.8" y2="19.8" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.2" y1="19.8" x2="5.6" y2="18.4" />
        <line x1="18.4" y1="5.6" x2="19.8" y2="4.2" />
      </g>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <rect x="3" y="4.5" width="18" height="16" rx="2.5" stroke="#64748b" strokeWidth="1.8" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" stroke="#64748b" strokeWidth="1.8" />
      <line x1="7.5" y1="2.5" x2="7.5" y2="6.5" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16.5" y1="2.5" x2="16.5" y2="6.5" stroke="#64748b" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9.5" stroke="#0f766e" strokeWidth="1.8" />
      <path d="M8 12.5l2.6 2.6L16 9.5" stroke="#0f766e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const keyframes = `
@keyframes floatA {
  0%   { transform: translate(-20%, -20%) scale(1); }
  50%  { transform: translate(30%, 25%) scale(1.4); }
  100% { transform: translate(-20%, -20%) scale(1); }
}
@keyframes floatB {
  0%   { transform: translate(10%, 10%) scale(1); }
  50%  { transform: translate(-30%, -20%) scale(1.35); }
  100% { transform: translate(10%, 10%) scale(1); }
}
@keyframes floatC {
  0%   { transform: translate(0,0) scale(0.9); }
  50%  { transform: translate(-25%, 20%) scale(1.3); }
  100% { transform: translate(0,0) scale(0.9); }
}
@keyframes floatD {
  0%   { transform: translate(0,0) scale(1); }
  50%  { transform: translate(20%, -25%) scale(1.25); }
  100% { transform: translate(0,0) scale(1); }
}
@keyframes floatE {
  0%   { transform: translate(-10%, 15%) scale(1); }
  50%  { transform: translate(15%, -15%) scale(1.3); }
  100% { transform: translate(-10%, 15%) scale(1); }
}
@keyframes ringPulse {
  0%   { transform: scale(0.9); opacity: 0.8; }
  70%  { transform: scale(1.7); opacity: 0; }
  100% { transform: scale(1.7); opacity: 0; }
}
@keyframes ringPulse2 {
  0%   { transform: scale(0.9); opacity: 0.6; }
  70%  { transform: scale(2.1); opacity: 0; }
  100% { transform: scale(2.1); opacity: 0; }
}
@keyframes waveHand {
  0%, 60%, 100% { transform: rotate(0deg); }
  10%, 30% { transform: rotate(14deg); }
  20%, 40% { transform: rotate(-8deg); }
}
@keyframes shimmer {
  0%   { transform: translateX(-120%) skewX(-15deg); }
  100% { transform: translateX(220%) skewX(-15deg); }
}
@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

const styles = {
  wrapper: {
    width: "100%",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    padding: "0px",
    boxSizing: "border-box",
  },
  card: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "22px",
    background: "linear-gradient(160deg, #fbfbff 0%, #f5f7ff 55%, #fdf9ff 100%)",
    border: "1px solid #e7e6f7",
    padding: "28px 36px",
    boxShadow:
      "0 16px 40px -18px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.6)",
  },
  blobBlue: {
    position: "absolute",
    top: "-25%",
    left: "-10%",
    width: "340px",
    height: "340px",
    background:
      "radial-gradient(circle, rgba(59,130,246,0.55) 0%, rgba(59,130,246,0) 68%)",
    animation: "floatA 8s ease-in-out infinite",
    pointerEvents: "none",
    mixBlendMode: "multiply",
  },
  blobViolet: {
    position: "absolute",
    bottom: "-30%",
    left: "18%",
    width: "300px",
    height: "300px",
    background:
      "radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0) 68%)",
    animation: "floatB 10s ease-in-out infinite",
    pointerEvents: "none",
    mixBlendMode: "multiply",
  },
  blobPink: {
    position: "absolute",
    top: "-15%",
    right: "12%",
    width: "280px",
    height: "280px",
    background:
      "radial-gradient(circle, rgba(236,72,153,0.5) 0%, rgba(236,72,153,0) 68%)",
    animation: "floatC 7s ease-in-out infinite",
    pointerEvents: "none",
    mixBlendMode: "multiply",
  },
  blobTeal: {
    position: "absolute",
    bottom: "-30%",
    right: "-8%",
    width: "320px",
    height: "320px",
    background:
      "radial-gradient(circle, rgba(20,184,166,0.5) 0%, rgba(20,184,166,0) 68%)",
    animation: "floatD 9s ease-in-out infinite",
    pointerEvents: "none",
    mixBlendMode: "multiply",
  },
  blobAmber: {
    position: "absolute",
    top: "20%",
    left: "45%",
    width: "220px",
    height: "220px",
    background:
      "radial-gradient(circle, rgba(245,158,11,0.4) 0%, rgba(245,158,11,0) 68%)",
    animation: "floatE 11s ease-in-out infinite",
    pointerEvents: "none",
    mixBlendMode: "multiply",
  },
  dots: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "radial-gradient(rgba(99,102,241,0.12) 1px, transparent 1px)",
    backgroundSize: "22px 22px",
    maskImage:
      "radial-gradient(ellipse at 30% 40%, black 0%, transparent 70%)",
    WebkitMaskImage:
      "radial-gradient(ellipse at 30% 40%, black 0%, transparent 70%)",
    pointerEvents: "none",
  },
  shine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "35%",
    height: "100%",
    background:
      "linear-gradient(75deg, transparent, rgba(255,255,255,0.75), transparent)",
    animation: "shimmer 4s ease-in-out infinite",
    pointerEvents: "none",
  },
  content: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "24px",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  avatarWrap: {
    position: "relative",
    width: "64px",
    height: "64px",
    flexShrink: 0,
  },
  avatarRing: {
    position: "absolute",
    inset: "-6px",
    borderRadius: "18px",
    border: "3px solid rgba(139,92,246,0.65)",
    animation: "ringPulse 2s ease-out infinite",
  },
  avatarRing2: {
    position: "absolute",
    inset: "-6px",
    borderRadius: "18px",
    border: "3px solid rgba(236,72,153,0.55)",
    animation: "ringPulse2 2s ease-out infinite 1s",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)",
    backgroundSize: "200% 200%",
    animation: "gradientShift 4s ease infinite",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
    fontWeight: 700,
    color: "#fff",
    boxShadow: "0 10px 22px -8px rgba(139,92,246,0.6)",
    position: "relative",
    zIndex: 2,
  },
  sunBadge: {
    position: "absolute",
    bottom: "-6px",
    right: "-6px",
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(30,41,59,0.18)",
    border: "1px solid #ece9fb",
    zIndex: 3,
  },
  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 800,
    color: "#111827",
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  gradientName: {
    background: "linear-gradient(90deg, #4f46e5, #a855f7 45%, #ec4899 85%)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    animation: "gradientShift 4s ease infinite",
  },
  wave: {
    display: "inline-block",
    transformOrigin: "70% 70%",
    animation: "waveHand 2.2s ease-in-out infinite",
  },
  metaRow: {
    marginTop: "8px",
  },
  tag: {
    display: "inline-block",
    padding: "5px 14px",
    borderRadius: "20px",
    background: "linear-gradient(90deg, #eef0ff, #fbe9f7)",
    border: "1px solid #e2ddf9",
    color: "#5b21b6",
    fontSize: "13px",
    fontWeight: 500,
  },
  dateRow: {
    marginTop: "10px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13.5px",
    color: "#64748b",
  },
  dateText: {
    color: "#475569",
  },
  divider: {
    color: "#d8d5ee",
    margin: "0 2px",
  },
  readyText: {
    color: "#0f766e",
    fontWeight: 500,
  },
  statsBox: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: "0",
    background: "#ffffff",
    border: "1px solid #ece9fb",
    borderRadius: "16px",
    padding: "16px 24px",
    boxShadow: "0 8px 24px -14px rgba(99,102,241,0.3)",
  },
  statCol: {
    textAlign: "center",
    padding: "0 14px",
  },
  statDivider: {
    width: "1px",
    height: "42px",
    background: "#efedf9",
  },
  statLabel: {
    fontSize: "12.5px",
    color: "#94a3b8",
    marginBottom: "8px",
    lineHeight: 1.3,
  },
  statValue: {
    fontSize: "20px",
    fontWeight: 800,
    borderRadius: "10px",
    padding: "4px 14px",
    display: "inline-block",
    minWidth: "20px",
  },
};



