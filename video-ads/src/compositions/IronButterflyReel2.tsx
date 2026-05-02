import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Video,
  staticFile,
} from "remotion";

// ─── Brand tokens ─────────────────────────────────────────────────────────────
const ACCENT = "#79F2C0";
const ACCENT2 = "#6BA7FF";
const ACCENT3 = "#C084FC";
const WHITE = "#FFFFFF";
const OFF_WHITE = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.65)";
const BG = "#050A10";

// Drop footage file into video-ads/public/ and set here
const VIDEO_FILE: string | null = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ease(frame: number, delay = 0, duration = 18, from = 0, to = 1): number {
  return interpolate(frame - delay, [0, duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
}

function pop(frame: number, fps: number, delay = 0, damping = 12, stiffness = 100): number {
  return spring({ frame: frame - delay, fps, config: { damping, stiffness, mass: 0.8 } });
}

// ─── Background ───────────────────────────────────────────────────────────────
const VideoBackground: React.FC = () => {
  if (VIDEO_FILE) {
    return (
      <>
        <Video
          src={staticFile(VIDEO_FILE)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <AbsoluteFill
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.50) 55%, rgba(0,0,0,0.78) 100%)" }}
        />
      </>
    );
  }
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 35%, rgba(107,167,255,0.22) 0%, transparent 65%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(121,242,192,0.12) 0%, transparent 55%),
          linear-gradient(180deg, #07121E 0%, #050A10 100%)
        `,
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 520,
          height: 900,
          background: "linear-gradient(180deg, rgba(121,242,192,0.07) 0%, rgba(107,167,255,0.10) 100%)",
          borderRadius: "260px 260px 0 0",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 820,
          left: "50%",
          transform: "translateX(-50%)",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(121,242,192,0.12), rgba(107,167,255,0.16))",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 760,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.16)",
          fontSize: 26,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          whiteSpace: "nowrap",
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        ADD YOUR FOOTAGE HERE
      </div>
    </AbsoluteFill>
  );
};

const Watermark: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      position: "absolute",
      top: 64,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      opacity: ease(frame, 0, 16),
      zIndex: 10,
    }}
  >
    <div
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
        boxShadow: `0 0 20px ${ACCENT}88`,
      }}
    />
    <span
      style={{
        color: OFF_WHITE,
        fontSize: 30,
        fontWeight: 700,
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
        letterSpacing: 0.5,
      }}
    >
      @ironbutterflycoaching
    </span>
  </div>
);

// ─── SCENE 1 · Controversy hook (0–1.5s = 0–45f) ─────────────────────────────
// "Nobody tells you this" curiosity gap hook
const HookScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s1 = pop(frame, fps, 0, 10, 120);
  const s2 = pop(frame, fps, 16, 10, 120);
  const s3 = pop(frame, fps, 30, 10, 120);

  const line = (
    text: React.ReactNode,
    sc: number,
    delay: number,
    size: number,
    gradient = false
  ) => (
    <div
      style={{
        opacity: ease(frame, delay, 12),
        transform: `scale(${interpolate(sc, [0, 1], [0.65, 1])})`,
      }}
    >
      <span
        style={
          gradient
            ? {
                fontSize: size,
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: -2,
                display: "block",
                background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }
            : {
                color: WHITE,
                fontSize: size,
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: -2,
                display: "block",
              }
        }
      >
        {text}
      </span>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 52px",
        gap: 8,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        textAlign: "center",
      }}
    >
      {line("Doctors won't", s1, 0, 80)}
      {line("tell you", s2, 16, 80)}
      {line("this.", s3, 30, 100, true)}
    </AbsoluteFill>
  );
};

// ─── SCENE 2 · The reveal (1.5–4s = 45–120f) ─────────────────────────────────
const RevealScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const headerPop = pop(frame, fps, 0, 12, 80);
  const subOpacity = ease(frame, 20, 18);
  const statOpacity = ease(frame, 36, 18);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 54px",
        gap: 24,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          opacity: ease(frame, 0, 16),
          transform: `translateY(${interpolate(headerPop, [0, 1], [40, 0])}px)`,
        }}
      >
        <span
          style={{
            color: ACCENT3,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 10,
          }}
        >
          The truth about your energy
        </span>
        <span
          style={{
            color: WHITE,
            fontSize: 60,
            fontWeight: 900,
            letterSpacing: -1.3,
            lineHeight: 1.05,
            display: "block",
          }}
        >
          Your body runs on{" "}
          <span
            style={{
              background: `linear-gradient(135deg, ${ACCENT3}, ${ACCENT})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            electricity.
          </span>
        </span>
      </div>

      <p
        style={{
          color: OFF_WHITE,
          fontSize: 32,
          lineHeight: 1.6,
          margin: 0,
          opacity: subOpacity,
        }}
      >
        Every cell in your body communicates through electromagnetic signals. When that
        signal gets weak — you feel it. As fatigue, pain, brain fog, and slow recovery.
      </p>

      <div
        style={{
          display: "flex",
          gap: 14,
          opacity: statOpacity,
        }}
      >
        {[
          { val: "37T", label: "cells in your body" },
          { val: "1MHz", label: "PEMF pulse frequency" },
          { val: "3–5cm", label: "tissue penetration" },
        ].map(({ val, label }) => (
          <div
            key={val}
            style={{
              flex: 1,
              padding: "18px 12px",
              borderRadius: 20,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              textAlign: "center",
            }}
          >
            <div style={{ color: ACCENT, fontSize: 36, fontWeight: 900, letterSpacing: -0.5 }}>
              {val}
            </div>
            <div style={{ color: MUTED, fontSize: 20, marginTop: 4, lineHeight: 1.3 }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 3 · Before/After comparison (4–7s = 120–210f) ─────────────────────
const BeforeAfterScene: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const headerY = interpolate(pop(frame, fps, 0, 12, 75), [0, 1], [35, 0]);

  const pairs = [
    { before: "Wake up exhausted", after: "Wake up recharged" },
    { before: "Chronic stiffness", after: "Joints move freely" },
    { before: "Afternoon crash", after: "Steady energy all day" },
    { before: "Can't wind down", after: "Deep, restful sleep" },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 52px",
        gap: 16,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          opacity: ease(frame, 0, 16),
          transform: `translateY(${headerY}px)`,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            color: WHITE,
            fontSize: 58,
            fontWeight: 900,
            letterSpacing: -1.2,
            lineHeight: 1.05,
            display: "block",
          }}
        >
          Before → After
        </span>
      </div>

      {/* Column headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          opacity: ease(frame, 10, 14),
        }}
      >
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,80,80,0.12)",
            border: "1px solid rgba(255,80,80,0.25)",
            color: "#FF8080",
            fontSize: 22,
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Before
        </div>
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 12,
            background: `${ACCENT}18`,
            border: `1px solid ${ACCENT}40`,
            color: ACCENT,
            fontSize: 22,
            fontWeight: 800,
            textAlign: "center",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          After
        </div>
      </div>

      {pairs.map(({ before, after }, i) => {
        const delay = i * 14 + 18;
        const itemPop = pop(frame, fps, delay, 13, 78);
        return (
          <div
            key={before}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              opacity: ease(frame, delay, 16),
              transform: `translateY(${interpolate(itemPop, [0, 1], [40, 0])}px)`,
            }}
          >
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 18,
                background: "rgba(255,80,80,0.07)",
                border: "1px solid rgba(255,80,80,0.15)",
                color: "rgba(255,180,180,0.85)",
                fontSize: 24,
                fontWeight: 600,
                lineHeight: 1.35,
              }}
            >
              ✗ {before}
            </div>
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 18,
                background: `${ACCENT}10`,
                border: `1px solid ${ACCENT}30`,
                color: ACCENT,
                fontSize: 24,
                fontWeight: 700,
                lineHeight: 1.35,
              }}
            >
              ✓ {after}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCENE 4 · What I offer (7–10s = 210–300f) ───────────────────────────────
const OfferScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const headerY = interpolate(pop(frame, fps, 0, 12, 75), [0, 1], [40, 0]);

  const items = [
    { icon: "⚡", text: "PEMF sessions — feel it in your first visit", color: ACCENT },
    { icon: "🧬", text: "Peptide protocols — targeted cellular support", color: ACCENT3 },
    { icon: "🌿", text: "1-on-1 coaching — your complete wellness plan", color: ACCENT2 },
    { icon: "🎁", text: "First session is FREE — no strings", color: WHITE },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 52px",
        gap: 20,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          opacity: ease(frame, 0, 16),
          transform: `translateY(${headerY}px)`,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            color: ACCENT,
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 8,
          }}
        >
          What I do
        </span>
        <span
          style={{
            color: WHITE,
            fontSize: 62,
            fontWeight: 900,
            letterSpacing: -1.3,
            lineHeight: 1.05,
            display: "block",
          }}
        >
          I help you feel
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            like yourself again.
          </span>
        </span>
      </div>

      {items.map(({ icon, text, color }, i) => {
        const delay = i * 16 + 14;
        const itemPop = pop(frame, fps, delay, 13, 80);
        return (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              padding: "18px 24px",
              borderRadius: 22,
              background: `${color}10`,
              border: `1px solid ${color}30`,
              opacity: ease(frame, delay, 16),
              transform: `translateX(${interpolate(itemPop, [0, 1], [-50, 0])}px)`,
            }}
          >
            <span style={{ fontSize: 34, flexShrink: 0 }}>{icon}</span>
            <span style={{ color: OFF_WHITE, fontSize: 28, fontWeight: 600, lineHeight: 1.4 }}>
              {text}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCENE 5 · CTA (10–15s = 300–450f) ───────────────────────────────────────
const CTAScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const glow = 0.6 + 0.4 * Math.sin((frame / 25) * Math.PI);
  const topPop = pop(frame, fps, 0, 12, 80);
  const btnPop = pop(frame, fps, 20, 11, 90);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 52px 100px",
        gap: 20,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        textAlign: "center",
      }}
    >
      {/* Big close line */}
      <div
        style={{
          opacity: ease(frame, 0, 20),
          transform: `translateY(${interpolate(topPop, [0, 1], [50, 0])}px)`,
        }}
      >
        <span
          style={{
            color: WHITE,
            fontSize: 68,
            fontWeight: 900,
            letterSpacing: -1.5,
            lineHeight: 1.05,
            display: "block",
          }}
        >
          Your reset
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            starts now.
          </span>
        </span>
      </div>

      {/* Coach card */}
      <div
        style={{
          padding: "28px 36px",
          borderRadius: 26,
          background: "rgba(5,10,16,0.82)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(20px)",
          width: "100%",
          opacity: ease(frame, 14, 18),
          transform: `translateY(${interpolate(pop(frame, fps, 14, 12, 78), [0, 1], [40, 0])}px)`,
        }}
      >
        <div style={{ color: WHITE, fontSize: 38, fontWeight: 900, letterSpacing: -0.7 }}>
          Sabrina Fan
        </div>
        <div style={{ color: ACCENT, fontSize: 23, fontWeight: 700, marginTop: 4, letterSpacing: 0.5 }}>
          Iron Butterfly Coaching · Costa Mesa, CA
        </div>
      </div>

      {/* CTA button */}
      <div
        style={{
          padding: "30px 0",
          borderRadius: 999,
          background: `linear-gradient(135deg, rgba(121,242,192,0.96), rgba(107,167,255,0.96))`,
          color: "#041019",
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: -0.4,
          boxShadow: `0 16px 60px rgba(107,167,255,${0.28 * glow}), 0 12px 50px rgba(121,242,192,${0.22 * glow})`,
          width: "100%",
          opacity: ease(frame, 20, 20),
          transform: `scale(${interpolate(btnPop, [0, 1], [0.9, 1])})`,
        }}
      >
        🗓 Book FREE — cal.com/sabrinafan
      </div>

      <div
        style={{
          color: MUTED,
          fontSize: 24,
          fontWeight: 600,
          opacity: ease(frame, 38, 16),
        }}
      >
        Link in bio · DM me "RESET" to get started
      </div>
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
// Timing (30fps):
//   0–45   (0–1.5s)  Hook: "Doctors won't tell you this."
//  45–120  (1.5–4s)  Reveal: your body runs on electricity
// 120–210  (4–7s)    Before / After grid
// 210–300  (7–10s)   What I offer
// 300–450  (10–15s)  CTA
export const IronButterflyReel2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: BG, overflow: "hidden" }}>
      <VideoBackground />
      <Watermark frame={frame} />

      <Sequence from={0} durationInFrames={45}>
        <HookScene frame={frame} fps={fps} />
      </Sequence>

      <Sequence from={45} durationInFrames={75}>
        <RevealScene frame={frame - 45} fps={fps} />
      </Sequence>

      <Sequence from={120} durationInFrames={90}>
        <BeforeAfterScene frame={frame - 120} fps={fps} />
      </Sequence>

      <Sequence from={210} durationInFrames={90}>
        <OfferScene frame={frame - 210} fps={fps} />
      </Sequence>

      <Sequence from={300} durationInFrames={150}>
        <CTAScene frame={frame - 300} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
