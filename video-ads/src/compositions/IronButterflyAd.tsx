import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─── Design tokens ──────────────────────────────────────────────────────────
const ACCENT = "#79F2C0";
const ACCENT2 = "#6BA7FF";
const TEXT = "#EAF2FF";
const MUTED = "rgba(234,242,255,0.72)";
const BG_DARK = "#050A10";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fadeIn(frame: number, delay = 0, duration = 20): number {
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

function slideUp(
  frame: number,
  fps: number,
  delay = 0,
  config = { damping: 14, stiffness: 80 }
): number {
  return spring({ frame: frame - delay, fps, config });
}

// ─── Gradient background ─────────────────────────────────────────────────────
const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `
        radial-gradient(ellipse 120% 60% at 20% -5%, rgba(107,167,255,0.30) 0%, transparent 60%),
        radial-gradient(ellipse 100% 55% at 85% 15%, rgba(121,242,192,0.25) 0%, transparent 55%),
        radial-gradient(ellipse 90% 50% at 55% 105%, rgba(255,211,107,0.12) 0%, transparent 55%),
        linear-gradient(180deg, ${BG_DARK} 0%, #061018 50%, #071826 100%)
      `,
    }}
  />
);

// ─── Floating orbs ───────────────────────────────────────────────────────────
const FloatingOrbs: React.FC<{ frame: number }> = ({ frame }) => {
  const y1 = Math.sin(frame / 80) * 14;
  const y2 = Math.sin((frame + 60) / 90) * 12;
  const y3 = Math.sin((frame + 120) / 70) * 10;

  const orbStyle = (
    top: string,
    left: string,
    size: number,
    y: number,
    opacity = 0.35
  ): React.CSSProperties => ({
    position: "absolute",
    top,
    left,
    width: size,
    height: size,
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.40), rgba(107,167,255,0.20) 55%, transparent 80%)",
    filter: "blur(1px)",
    mixBlendMode: "screen",
    opacity,
    transform: `translateY(${y}px)`,
  });

  return (
    <>
      <div style={orbStyle("8%", "5%", 260, y1, 0.32)} />
      <div style={orbStyle("42%", "60%", 320, y2, 0.28)} />
      <div style={orbStyle("72%", "10%", 200, y3, 0.22)} />
    </>
  );
};

// ─── Pill badge ──────────────────────────────────────────────────────────────
const Pill: React.FC<{ children: React.ReactNode; opacity: number }> = ({
  children,
  opacity,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 20px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.14)",
      color: MUTED,
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: 1,
      opacity,
    }}
  >
    {children}
  </div>
);

// ─── Section 1 · Brand intro (0–2s = frames 0-60) ───────────────────────────
const IntroSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const tagOpacity = fadeIn(frame, 20, 25);
  const subOpacity = fadeIn(frame, 38, 20);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "0 60px",
        textAlign: "center",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Dot + brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
            boxShadow: `0 0 40px rgba(121,242,192,0.6)`,
          }}
        />
        <span
          style={{
            color: TEXT,
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          Iron Butterfly Coaching
        </span>
      </div>

      <div style={{ opacity: tagOpacity }}>
        <Pill opacity={1}>
          ⚡ PEMF · Internal Thermal Circulation
        </Pill>
      </div>

      <p
        style={{
          color: MUTED,
          fontSize: 34,
          lineHeight: 1.5,
          margin: 0,
          opacity: subOpacity,
          maxWidth: 780,
        }}
      >
        Costa Mesa, CA · Free session available
      </p>
    </AbsoluteFill>
  );
};

// ─── Section 2 · Device reveal (2–5s = frames 60-150) ────────────────────────
const DeviceSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const titleSlide = slideUp(frame, fps, 0, { damping: 13, stiffness: 70 });
  const cardOpacity = fadeIn(frame, 15, 25);
  const cardScale = interpolate(frame, [15, 40], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const gradientLine = (
    <div
      style={{
        height: 2,
        background: `linear-gradient(90deg, transparent, ${ACCENT}, ${ACCENT2}, transparent)`,
        borderRadius: 1,
        margin: "20px 0",
        opacity: fadeIn(frame, 10, 20),
      }}
    />
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Big device name */}
      <div
        style={{
          transform: `translateY(${interpolate(titleSlide, [0, 1], [60, 0])}px)`,
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <p
          style={{
            color: ACCENT,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
            margin: 0,
            textTransform: "uppercase",
          }}
        >
          Introducing
        </p>
        <h1
          style={{
            color: TEXT,
            fontSize: 88,
            fontWeight: 900,
            margin: "8px 0 0",
            letterSpacing: -2,
            lineHeight: 1.0,
            background: `linear-gradient(135deg, ${TEXT} 30%, ${ACCENT2} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Tera‑P90+
        </h1>
        {gradientLine}
        <p
          style={{
            color: MUTED,
            fontSize: 38,
            margin: 0,
            lineHeight: 1.4,
            fontWeight: 500,
          }}
        >
          Internal heat penetration—
          <br />
          <em>without</em> the sauna.
        </p>
      </div>

      {/* Spec chips */}
      <div
        style={{
          display: "flex",
          gap: 18,
          flexWrap: "wrap",
          justifyContent: "center",
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
        }}
      >
        {[
          { val: "20", label: "Intensity\nLevels" },
          { val: "3–5cm", label: "Deep\nPenetration" },
          { val: "1MHz", label: "Pulse\nCurrent" },
        ].map(({ val, label }) => (
          <div
            key={val}
            style={{
              padding: "22px 30px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.14)",
              textAlign: "center",
              minWidth: 180,
            }}
          >
            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: ACCENT,
                letterSpacing: -1,
              }}
            >
              {val}
            </div>
            <div
              style={{
                fontSize: 24,
                color: MUTED,
                marginTop: 6,
                whiteSpace: "pre-line",
                lineHeight: 1.3,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 3 · Benefits (5–9s = frames 150-270) ────────────────────────────
interface Benefit {
  icon: string;
  title: string;
  desc: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: "🔥",
    title: "Deep Relaxation",
    desc: "Muscles release. Tension drops. Body shifts into recovery mode.",
  },
  {
    icon: "🩸",
    title: "Circulation Support",
    desc: "Vasodilation + blood flow—especially for cold hands and feet.",
  },
  {
    icon: "💤",
    title: "Sleep Support",
    desc: "Many use it as a pre-bed ritual to unwind and sleep deeper.",
  },
];

const BenefitCard: React.FC<{
  benefit: Benefit;
  frame: number;
  fps: number;
  delay: number;
}> = ({ benefit, frame, fps, delay }) => {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 75 },
  });
  const opacity = fadeIn(frame, delay, 18);
  const translateY = interpolate(progress, [0, 1], [80, 0]);

  return (
    <div
      style={{
        padding: "28px 32px",
        borderRadius: 28,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.13)",
        backdropFilter: "blur(14px)",
        opacity,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        alignItems: "flex-start",
        gap: 24,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          flexShrink: 0,
          borderRadius: 18,
          background: `linear-gradient(135deg, rgba(121,242,192,0.22), rgba(107,167,255,0.20))`,
          border: "1px solid rgba(255,255,255,0.14)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 32,
        }}
      >
        {benefit.icon}
      </div>
      <div>
        <div
          style={{
            color: TEXT,
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 8,
            letterSpacing: -0.3,
          }}
        >
          {benefit.title}
        </div>
        <div style={{ color: MUTED, fontSize: 27, lineHeight: 1.45 }}>
          {benefit.desc}
        </div>
      </div>
    </div>
  );
};

const BenefitsSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const headerOpacity = fadeIn(frame, 0, 20);
  const headerY = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 70 } }),
    [0, 1],
    [40, 0]
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 60px",
        gap: 28,
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
        <Pill opacity={1}>💎 What you'll actually feel</Pill>
        <h2
          style={{
            color: TEXT,
            fontSize: 60,
            fontWeight: 800,
            margin: "18px 0 0",
            letterSpacing: -1.2,
            lineHeight: 1.1,
          }}
        >
          Benefits people
          <br />
          come back for
        </h2>
      </div>

      {BENEFITS.map((b, i) => (
        <BenefitCard
          key={b.title}
          benefit={b}
          frame={frame}
          fps={fps}
          delay={i * 15 + 12}
        />
      ))}
    </AbsoluteFill>
  );
};

// ─── Section 4 · Testimonial quote (9–12s = frames 270-360) ──────────────────
const TestimonialSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const quoteSlide = spring({ frame, fps, config: { damping: 13, stiffness: 60 } });
  const quoteY = interpolate(quoteSlide, [0, 1], [70, 0]);
  const opacity = fadeIn(frame, 0, 22);

  // Typing cursor blink
  const cursor = frame % 30 < 15 ? "|" : "";

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 70px",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${quoteY}px)`,
          textAlign: "center",
        }}
      >
        {/* Stars */}
        <div style={{ color: ACCENT, fontSize: 52, marginBottom: 24, letterSpacing: 4 }}>
          ★★★★★
        </div>

        {/* Quote card */}
        <div
          style={{
            padding: "50px 52px",
            borderRadius: 36,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.13)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
            marginBottom: 32,
          }}
        >
          <p
            style={{
              color: TEXT,
              fontSize: 36,
              lineHeight: 1.65,
              margin: 0,
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            "After my first session, I stood up and my hips felt{" "}
            <span style={{ color: ACCENT }}>noticeably looser</span>. I slept
            deeper that night. Now it's my non-negotiable reset.
            <span style={{ color: ACCENT, opacity: 0.7 }}>{cursor}</span>"
          </p>
        </div>

        <div
          style={{
            color: MUTED,
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          — Marissa, 58 · Mobility & Stiffness
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 5 · CTA (12–15s = frames 360-450) ───────────────────────────────
const CTASection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const scaleProgress = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 65 },
  });
  const scale = interpolate(scaleProgress, [0, 1], [0.88, 1]);
  const opacity = fadeIn(frame, 0, 22);

  // Pulsing glow on CTA button
  const glow = interpolate(
    Math.sin((frame / 30) * Math.PI),
    [-1, 1],
    [0.5, 1.0]
  );

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        gap: 36,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        textAlign: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      {/* Heading */}
      <div>
        <p
          style={{
            color: ACCENT,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 3,
            margin: "0 0 12px",
            textTransform: "uppercase",
          }}
        >
          Ready to feel the difference?
        </p>
        <h2
          style={{
            color: TEXT,
            fontSize: 74,
            fontWeight: 900,
            margin: 0,
            letterSpacing: -1.5,
            lineHeight: 1.05,
          }}
        >
          Book Your
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Free Session
          </span>
        </h2>
      </div>

      {/* Details */}
      <div
        style={{
          padding: "28px 36px",
          borderRadius: 24,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          width: "100%",
        }}
      >
        <div style={{ color: TEXT, fontSize: 32, fontWeight: 700 }}>
          Iron Butterfly Coaching
        </div>
        <div style={{ color: MUTED, fontSize: 26, marginTop: 8, lineHeight: 1.5 }}>
          📍 Costa Mesa CA 92626
          <br />
          15–30 min guided session · No pressure
        </div>
      </div>

      {/* CTA Button */}
      <div
        style={{
          padding: "32px 64px",
          borderRadius: 999,
          background: `linear-gradient(135deg, rgba(121,242,192,0.95), rgba(107,167,255,0.95))`,
          color: "#041019",
          fontSize: 40,
          fontWeight: 800,
          letterSpacing: -0.5,
          boxShadow: `0 20px 70px rgba(107,167,255,${0.25 * glow}), 0 16px 55px rgba(121,242,192,${0.20 * glow})`,
          width: "100%",
        }}
      >
        cal.com/sabrinafan →
      </div>

      {/* Disclaimer */}
      <p
        style={{
          color: "rgba(234,242,255,0.40)",
          fontSize: 22,
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        Wellness support technology. Not medical advice.
        <br />
        Individual experiences vary.
      </p>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────
export const IronButterflyAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section timing (at 30 fps):
  // 0-60   → Intro (0–2s)
  // 60-150 → Device reveal (2–5s)
  // 150-270→ Benefits (5–9s)
  // 270-360→ Testimonial (9–12s)
  // 360-450→ CTA (12–15s)

  return (
    <AbsoluteFill style={{ background: BG_DARK }}>
      <Background />
      <FloatingOrbs frame={frame} />

      <Sequence from={0} durationInFrames={60}>
        <IntroSection frame={frame} fps={fps} />
      </Sequence>

      <Sequence from={60} durationInFrames={90}>
        <DeviceSection frame={frame - 60} fps={fps} />
      </Sequence>

      <Sequence from={150} durationInFrames={120}>
        <BenefitsSection frame={frame - 150} fps={fps} />
      </Sequence>

      <Sequence from={270} durationInFrames={90}>
        <TestimonialSection frame={frame - 270} fps={fps} />
      </Sequence>

      <Sequence from={360} durationInFrames={90}>
        <CTASection frame={frame - 360} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
