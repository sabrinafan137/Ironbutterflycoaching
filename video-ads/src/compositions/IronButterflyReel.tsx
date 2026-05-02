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
const ACCENT = "#79F2C0";   // green  – PEMF
const ACCENT2 = "#6BA7FF";  // blue   – coaching
const ACCENT3 = "#C084FC";  // purple – peptides
const WHITE = "#FFFFFF";
const OFF_WHITE = "rgba(255,255,255,0.92)";
const MUTED = "rgba(255,255,255,0.65)";
const BG = "#050A10";

// ─── Props ────────────────────────────────────────────────────────────────────
// Drop your .mp4 / .mov file into video-ads/public/ and set VIDEO_FILE.
// Set to null to use the gradient placeholder instead.
const VIDEO_FILE: string | null = null; // e.g. "sabrina-footage.mp4"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ease(
  frame: number,
  delay = 0,
  duration = 18,
  from = 0,
  to = 1
): number {
  return interpolate(frame - delay, [0, duration], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
}

function pop(
  frame: number,
  fps: number,
  delay = 0,
  damping = 12,
  stiffness = 100
): number {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping, stiffness, mass: 0.8 },
  });
}

// ─── Talking-head video background ───────────────────────────────────────────
const VideoBackground: React.FC = () => {
  if (VIDEO_FILE) {
    return (
      <>
        <Video
          src={staticFile(VIDEO_FILE)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Dark scrim for text legibility */}
        <AbsoluteFill
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.75) 100%)" }}
        />
      </>
    );
  }

  // Placeholder gradient until footage is added
  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 35%, rgba(107,167,255,0.22) 0%, transparent 65%),
          radial-gradient(ellipse 60% 40% at 20% 80%, rgba(192,132,252,0.14) 0%, transparent 55%),
          linear-gradient(180deg, #07121E 0%, #050A10 100%)
        `,
      }}
    >
      {/* Silhouette placeholder */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 520,
          height: 900,
          background:
            "linear-gradient(180deg, rgba(121,242,192,0.08) 0%, rgba(107,167,255,0.12) 100%)",
          borderRadius: "260px 260px 0 0",
          border: "1px solid rgba(255,255,255,0.07)",
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
          background:
            "linear-gradient(135deg, rgba(121,242,192,0.14), rgba(107,167,255,0.18))",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 760,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.18)",
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

// ─── Name watermark (always visible) ─────────────────────────────────────────
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

// ─── SCENE 1 · Hook slam (0–1.5s = 0–45f) ────────────────────────────────────
// Pattern interrupt: challenge a belief they hold right now
const HookScene: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const line1Scale = pop(frame, fps, 0, 10, 130);
  const line1Opacity = ease(frame, 0, 12);
  const line2Delay = 18;
  const line2Scale = pop(frame, fps, line2Delay, 10, 130);
  const line2Opacity = ease(frame, line2Delay, 12);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 52px",
        gap: 10,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        textAlign: "center",
      }}
    >
      <div
        style={{
          opacity: line1Opacity,
          transform: `scale(${interpolate(line1Scale, [0, 1], [0.7, 1])})`,
        }}
      >
        <span
          style={{
            color: WHITE,
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -3,
            display: "block",
          }}
        >
          You're not
        </span>
        <span
          style={{
            color: WHITE,
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -3,
            display: "block",
          }}
        >
          tired.
        </span>
      </div>

      <div
        style={{
          opacity: line2Opacity,
          transform: `scale(${interpolate(line2Scale, [0, 1], [0.7, 1])})`,
          marginTop: 16,
        }}
      >
        <span
          style={{
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -3,
            display: "block",
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          You're
        </span>
        <span
          style={{
            fontSize: 108,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: -3,
            display: "block",
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          DEPLETED.
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 2 · Relatable symptoms (1.5–4s = 45–120f) ─────────────────────────
const SYMPTOMS = [
  { emoji: "😴", text: "Tired even after 8 hours of sleep" },
  { emoji: "🧠", text: "Brain fog by 2pm every single day" },
  { emoji: "🥶", text: "Cold hands and feet, low circulation" },
  { emoji: "😰", text: "Stress you can't seem to shake" },
];

const SymptomsScene: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const headerOpacity = ease(frame, 0, 16);
  const headerY = interpolate(pop(frame, fps, 0, 13, 80), [0, 1], [30, 0]);

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
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            color: ACCENT,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 8,
          }}
        >
          Sound familiar?
        </span>
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
          Your body is
          <br />
          sending signals.
        </span>
      </div>

      {SYMPTOMS.map(({ emoji, text }, i) => {
        const delay = i * 14 + 10;
        const itemPop = pop(frame, fps, delay, 13, 80);
        return (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "20px 26px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              opacity: ease(frame, delay, 16),
              transform: `translateX(${interpolate(itemPop, [0, 1], [-60, 0])}px)`,
            }}
          >
            <span style={{ fontSize: 38, flexShrink: 0 }}>{emoji}</span>
            <span style={{ color: OFF_WHITE, fontSize: 30, fontWeight: 600, lineHeight: 1.35 }}>
              {text}
            </span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCENE 3 · Cause reveal (4–6s = 120–180f) ────────────────────────────────
const CauseScene: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const bigPop = pop(frame, fps, 0, 11, 90);
  const subOpacity = ease(frame, 22, 18);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 56px",
        textAlign: "center",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        gap: 24,
      }}
    >
      <div style={{ transform: `scale(${interpolate(bigPop, [0, 1], [0.75, 1])})`, opacity: ease(frame, 0, 14) }}>
        <span
          style={{
            color: WHITE,
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: -1.8,
            lineHeight: 1.0,
            display: "block",
          }}
        >
          Your cells aren't
        </span>
        <span
          style={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: -1.8,
            lineHeight: 1.0,
            display: "block",
            background: `linear-gradient(135deg, ${ACCENT3}, ${ACCENT})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          getting the signal.
        </span>
      </div>

      <p
        style={{
          color: MUTED,
          fontSize: 34,
          lineHeight: 1.55,
          margin: 0,
          opacity: subOpacity,
          maxWidth: 820,
        }}
      >
        Poor circulation, low cellular energy, and chronic stress block
        your body's ability to recover — no matter how much you sleep.
      </p>
    </AbsoluteFill>
  );
};

// ─── SCENE 4 · Solution: three pillars (6–10s = 180–300f) ────────────────────
const PILLARS = [
  {
    icon: "⚡",
    title: "PEMF Sessions",
    desc: "Internal warmth + magnetic reset. Feet-based. Fully clothed.",
    color: ACCENT,
  },
  {
    icon: "🧬",
    title: "Peptide Protocols",
    desc: "Cellular vitality. Targeted recovery. Personalized to you.",
    color: ACCENT3,
  },
  {
    icon: "🌿",
    title: "1-on-1 Coaching",
    desc: "Your roadmap. Nutrition, lifestyle, accountability.",
    color: ACCENT2,
  },
];

const SolutionScene: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const headerY = interpolate(pop(frame, fps, 0, 13, 75), [0, 1], [40, 0]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 52px",
        gap: 22,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          opacity: ease(frame, 0, 18),
          transform: `translateY(${headerY}px)`,
          marginBottom: 4,
        }}
      >
        <span
          style={{
            color: ACCENT,
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 3,
            textTransform: "uppercase",
            display: "block",
            marginBottom: 8,
          }}
        >
          Here's what actually works
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
          Three pillars.
          <br />
          One protocol.
        </span>
      </div>

      {PILLARS.map(({ icon, title, desc, color }, i) => {
        const delay = i * 20 + 14;
        const itemPop = pop(frame, fps, delay, 13, 78);
        return (
          <div
            key={title}
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              padding: "24px 28px",
              borderRadius: 26,
              background: `${color}12`,
              border: `1px solid ${color}38`,
              opacity: ease(frame, delay, 18),
              transform: `translateY(${interpolate(itemPop, [0, 1], [50, 0])}px)`,
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                flexShrink: 0,
                borderRadius: 16,
                background: `${color}22`,
                border: `1px solid ${color}44`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              {icon}
            </div>
            <div>
              <div style={{ color: WHITE, fontSize: 34, fontWeight: 800, letterSpacing: -0.4, marginBottom: 6 }}>
                {title}
              </div>
              <div style={{ color: MUTED, fontSize: 26, lineHeight: 1.45 }}>{desc}</div>
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ─── SCENE 5 · Social proof flash (10–12.5s = 300–375f) ──────────────────────
const ProofScene: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const cardPop = pop(frame, fps, 0, 11, 85);
  const cardScale = interpolate(cardPop, [0, 1], [0.82, 1]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        textAlign: "center",
        gap: 28,
      }}
    >
      <div style={{ opacity: ease(frame, 0, 16) }}>
        <span style={{ color: ACCENT, fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}>
          Real results
        </span>
      </div>

      <div
        style={{
          padding: "44px 48px",
          borderRadius: 34,
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(16px)",
          transform: `scale(${cardScale})`,
          opacity: ease(frame, 0, 18),
        }}
      >
        <div style={{ color: ACCENT, fontSize: 48, letterSpacing: 4, marginBottom: 20 }}>
          ★★★★★
        </div>
        <p
          style={{
            color: OFF_WHITE,
            fontSize: 35,
            lineHeight: 1.65,
            margin: 0,
            fontStyle: "italic",
            fontWeight: 500,
          }}
        >
          "I stood up after my first session and my hips felt{" "}
          <span style={{ color: ACCENT, fontStyle: "normal", fontWeight: 800 }}>
            noticeably looser.
          </span>{" "}
          Slept deeper that night. Now it's my non-negotiable weekly reset."
        </p>
        <div
          style={{
            color: MUTED,
            fontSize: 26,
            marginTop: 20,
            fontWeight: 600,
            opacity: ease(frame, 25, 16),
          }}
        >
          — Marissa, 58
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── SCENE 6 · CTA (12.5–17s = 375–510f) ─────────────────────────────────────
const CTAScene: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const glow = 0.6 + 0.4 * Math.sin((frame / 25) * Math.PI);
  const topPop = pop(frame, fps, 0, 12, 80);
  const btnPop = pop(frame, fps, 22, 11, 90);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 52px 100px",
        gap: 24,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        textAlign: "center",
      }}
    >
      {/* Coach name card */}
      <div
        style={{
          padding: "30px 40px",
          borderRadius: 28,
          background: "rgba(5,10,16,0.82)",
          border: "1px solid rgba(255,255,255,0.14)",
          backdropFilter: "blur(20px)",
          width: "100%",
          opacity: ease(frame, 0, 20),
          transform: `translateY(${interpolate(topPop, [0, 1], [50, 0])}px)`,
        }}
      >
        <div
          style={{
            color: WHITE,
            fontSize: 40,
            fontWeight: 900,
            letterSpacing: -0.8,
            marginBottom: 6,
          }}
        >
          Sabrina Fan
        </div>
        <div style={{ color: ACCENT, fontSize: 24, fontWeight: 700, marginBottom: 12, letterSpacing: 0.5 }}>
          Iron Butterfly Coaching
        </div>
        <div style={{ color: MUTED, fontSize: 24, lineHeight: 1.45 }}>
          PEMF · Peptides · 1-on-1 Health Coaching
          <br />
          📍 Costa Mesa, CA
        </div>
      </div>

      {/* CTA button */}
      <div
        style={{
          padding: "32px 0",
          borderRadius: 999,
          background: `linear-gradient(135deg, rgba(121,242,192,0.96), rgba(107,167,255,0.96))`,
          color: "#041019",
          fontSize: 38,
          fontWeight: 900,
          letterSpacing: -0.5,
          boxShadow: `0 16px 60px rgba(107,167,255,${0.30 * glow}), 0 12px 50px rgba(121,242,192,${0.25 * glow})`,
          width: "100%",
          opacity: ease(frame, 22, 20),
          transform: `scale(${interpolate(btnPop, [0, 1], [0.9, 1])})`,
        }}
      >
        🗓 Book a FREE Session
      </div>

      {/* Handle */}
      <div
        style={{
          color: MUTED,
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: 0.5,
          opacity: ease(frame, 35, 18),
        }}
      >
        cal.com/sabrinafan
      </div>
    </AbsoluteFill>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────
// Timing (30fps):
//   0–45   (0–1.5s)  Hook: "You're not tired. You're DEPLETED."
//  45–120  (1.5–4s)  Symptoms checklist
// 120–180  (4–6s)    Cause reveal
// 180–300  (6–10s)   Solution: 3 pillars
// 300–375  (10–12.5s)Social proof
// 375–510  (12.5–17s)CTA
export const IronButterflyReel: React.FC = () => {
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
        <SymptomsScene frame={frame - 45} fps={fps} />
      </Sequence>

      <Sequence from={120} durationInFrames={60}>
        <CauseScene frame={frame - 120} fps={fps} />
      </Sequence>

      <Sequence from={180} durationInFrames={120}>
        <SolutionScene frame={frame - 180} fps={fps} />
      </Sequence>

      <Sequence from={300} durationInFrames={75}>
        <ProofScene frame={frame - 300} fps={fps} />
      </Sequence>

      <Sequence from={375} durationInFrames={135}>
        <CTAScene frame={frame - 375} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
