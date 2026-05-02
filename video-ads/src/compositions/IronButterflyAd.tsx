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
const ACCENT3 = "#C084FC"; // purple for peptides
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
        radial-gradient(ellipse 120% 60% at 20% -5%, rgba(107,167,255,0.28) 0%, transparent 60%),
        radial-gradient(ellipse 100% 55% at 85% 15%, rgba(121,242,192,0.22) 0%, transparent 55%),
        radial-gradient(ellipse 80% 45% at 10% 80%, rgba(192,132,252,0.14) 0%, transparent 55%),
        radial-gradient(ellipse 90% 50% at 55% 105%, rgba(255,211,107,0.10) 0%, transparent 55%),
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
    color = "rgba(107,167,255,0.20)",
    opacity = 0.30
  ): React.CSSProperties => ({
    position: "absolute",
    top,
    left,
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.35), ${color} 55%, transparent 80%)`,
    filter: "blur(1px)",
    mixBlendMode: "screen",
    opacity,
    transform: `translateY(${y}px)`,
  });

  return (
    <>
      <div style={orbStyle("8%", "5%", 260, y1, "rgba(107,167,255,0.22)", 0.30)} />
      <div style={orbStyle("42%", "60%", 300, y2, "rgba(121,242,192,0.20)", 0.26)} />
      <div style={orbStyle("72%", "10%", 200, y3, "rgba(192,132,252,0.18)", 0.22)} />
    </>
  );
};

// ─── Pill badge ──────────────────────────────────────────────────────────────
const Pill: React.FC<{ children: React.ReactNode; opacity?: number }> = ({
  children,
  opacity = 1,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 22px",
      borderRadius: 999,
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(255,255,255,0.14)",
      color: MUTED,
      fontSize: 26,
      fontWeight: 600,
      letterSpacing: 0.8,
      opacity,
    }}
  >
    {children}
  </div>
);

// ─── Section 1 · Brand intro (0–2s = frames 0–60) ────────────────────────────
const IntroSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 60 } });
  const pill1Opacity = fadeIn(frame, 18, 22);
  const pill2Opacity = fadeIn(frame, 30, 22);
  const pill3Opacity = fadeIn(frame, 42, 22);
  const subOpacity = fadeIn(frame, 52, 18);

  const pillData = [
    { label: "⚡ PEMF Sessions", opacity: pill1Opacity },
    { label: "🧬 Peptides", opacity: pill2Opacity },
    { label: "🌿 Health Coaching", opacity: pill3Opacity },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
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
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          Iron Butterfly Coaching
        </span>
      </div>

      {/* Three service pills */}
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        {pillData.map(({ label, opacity }) => (
          <Pill key={label} opacity={opacity}>
            {label}
          </Pill>
        ))}
      </div>

      <p
        style={{
          color: MUTED,
          fontSize: 32,
          lineHeight: 1.5,
          margin: 0,
          opacity: subOpacity,
          maxWidth: 780,
        }}
      >
        Costa Mesa, CA · Whole-body wellness
      </p>
    </AbsoluteFill>
  );
};

// ─── Section 2 · Three-service overview (2–6s = frames 60–180) ───────────────
interface ServiceCard {
  icon: string;
  title: string;
  subtitle: string;
  points: string[];
  accent: string;
}

const SERVICES: ServiceCard[] = [
  {
    icon: "⚡",
    title: "PEMF Sessions",
    subtitle: "Tera-P90+ Internal Thermal",
    points: ["Deep internal warmth via feet", "20 intensity levels", "Fully clothed & comfortable"],
    accent: ACCENT,
  },
  {
    icon: "🧬",
    title: "Peptide Protocols",
    subtitle: "Targeted wellness support",
    points: ["Personalized peptide guidance", "Cellular vitality & recovery", "Cutting-edge wellness science"],
    accent: ACCENT3,
  },
  {
    icon: "🌿",
    title: "Health Coaching",
    subtitle: "1-on-1 consulting",
    points: ["Custom wellness roadmap", "Nutrition & lifestyle guidance", "Ongoing accountability"],
    accent: ACCENT2,
  },
];

const ServiceCardComponent: React.FC<{
  service: ServiceCard;
  frame: number;
  fps: number;
  delay: number;
}> = ({ service, frame, fps, delay }) => {
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 72 },
  });
  const opacity = fadeIn(frame, delay, 20);
  const translateY = interpolate(progress, [0, 1], [90, 0]);

  return (
    <div
      style={{
        padding: "28px 30px",
        borderRadius: 28,
        background: "rgba(255,255,255,0.055)",
        border: `1px solid ${service.accent}33`,
        backdropFilter: "blur(14px)",
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 16 }}>
        <div
          style={{
            width: 58,
            height: 58,
            flexShrink: 0,
            borderRadius: 16,
            background: `linear-gradient(135deg, ${service.accent}30, ${service.accent}15)`,
            border: `1px solid ${service.accent}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
        >
          {service.icon}
        </div>
        <div>
          <div style={{ color: TEXT, fontSize: 32, fontWeight: 800, letterSpacing: -0.4 }}>
            {service.title}
          </div>
          <div style={{ color: service.accent, fontSize: 22, fontWeight: 600, marginTop: 2 }}>
            {service.subtitle}
          </div>
        </div>
      </div>

      {/* Points */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {service.points.map((pt) => (
          <div
            key={pt}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              color: MUTED,
              fontSize: 24,
              lineHeight: 1.4,
            }}
          >
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: service.accent,
                flexShrink: 0,
              }}
            />
            {pt}
          </div>
        ))}
      </div>
    </div>
  );
};

const ServicesSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const headerY = interpolate(
    spring({ frame, fps, config: { damping: 14, stiffness: 70 } }),
    [0, 1],
    [40, 0]
  );
  const headerOpacity = fadeIn(frame, 0, 20);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 56px",
        gap: 22,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: 4,
        }}
      >
        <Pill>✦ Three ways to transform</Pill>
        <h2
          style={{
            color: TEXT,
            fontSize: 56,
            fontWeight: 800,
            margin: "14px 0 0",
            letterSpacing: -1.2,
            lineHeight: 1.1,
          }}
        >
          Your complete
          <br />
          wellness platform
        </h2>
      </div>

      {SERVICES.map((s, i) => (
        <ServiceCardComponent
          key={s.title}
          service={s}
          frame={frame}
          fps={fps}
          delay={i * 18 + 14}
        />
      ))}
    </AbsoluteFill>
  );
};

// ─── Section 3 · Peptide spotlight (6–9s = frames 180–270) ───────────────────
const PeptideSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const titleSlide = slideUp(frame, fps, 0, { damping: 13, stiffness: 68 });
  const titleY = interpolate(titleSlide, [0, 1], [60, 0]);

  const items = [
    { icon: "🔬", title: "Science-backed protocols", desc: "Guidance rooted in emerging peptide wellness research." },
    { icon: "🎯", title: "Targeted support", desc: "Recovery, vitality, sleep, and metabolic wellness." },
    { icon: "👤", title: "Personalized to you", desc: "Your goals, your body, your custom roadmap." },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 58px",
        gap: 28,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ transform: `translateY(${titleY}px)`, opacity: fadeIn(frame, 0, 20) }}>
        <div
          style={{
            display: "inline-block",
            padding: "8px 18px",
            borderRadius: 999,
            background: `${ACCENT3}22`,
            border: `1px solid ${ACCENT3}44`,
            color: ACCENT3,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          🧬 Peptide Protocols
        </div>
        <h2
          style={{
            color: TEXT,
            fontSize: 64,
            fontWeight: 900,
            margin: 0,
            letterSpacing: -1.4,
            lineHeight: 1.05,
          }}
        >
          Wellness at the
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${ACCENT3}, ${ACCENT2})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            cellular level.
          </span>
        </h2>
      </div>

      {items.map(({ icon, title, desc }, i) => (
        <div
          key={title}
          style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            opacity: fadeIn(frame, i * 14 + 16, 18),
            transform: `translateY(${interpolate(
              spring({ frame: frame - (i * 14 + 16), fps, config: { damping: 14, stiffness: 75 } }),
              [0, 1],
              [50, 0]
            )}px)`,
            padding: "22px 26px",
            borderRadius: 22,
            background: "rgba(255,255,255,0.055)",
            border: `1px solid ${ACCENT3}28`,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              flexShrink: 0,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${ACCENT3}28, ${ACCENT2}18)`,
              border: `1px solid ${ACCENT3}38`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
            }}
          >
            {icon}
          </div>
          <div>
            <div style={{ color: TEXT, fontSize: 32, fontWeight: 700, letterSpacing: -0.3, marginBottom: 6 }}>
              {title}
            </div>
            <div style={{ color: MUTED, fontSize: 25, lineHeight: 1.45 }}>{desc}</div>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ─── Section 4 · Coaching spotlight (9–12s = frames 270–360) ─────────────────
const CoachingSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const titleSlide = slideUp(frame, fps, 0, { damping: 13, stiffness: 68 });
  const titleY = interpolate(titleSlide, [0, 1], [60, 0]);

  const steps = [
    { num: "01", title: "Discovery call", desc: "We map your health history, goals, and lifestyle." },
    { num: "02", title: "Custom plan", desc: "PEMF sessions + peptide guidance + nutrition strategy." },
    { num: "03", title: "Ongoing support", desc: "Accountability check-ins and protocol adjustments." },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 58px",
        gap: 26,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ transform: `translateY(${titleY}px)`, opacity: fadeIn(frame, 0, 20) }}>
        <div
          style={{
            display: "inline-block",
            padding: "8px 18px",
            borderRadius: 999,
            background: `${ACCENT2}22`,
            border: `1px solid ${ACCENT2}44`,
            color: ACCENT2,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          🌿 Health Coaching
        </div>
        <h2
          style={{
            color: TEXT,
            fontSize: 62,
            fontWeight: 900,
            margin: 0,
            letterSpacing: -1.3,
            lineHeight: 1.05,
          }}
        >
          Your guide to
          <br />
          <span
            style={{
              background: `linear-gradient(135deg, ${ACCENT2}, ${ACCENT})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            lasting results.
          </span>
        </h2>
      </div>

      {steps.map(({ num, title, desc }, i) => (
        <div
          key={num}
          style={{
            display: "flex",
            gap: 22,
            alignItems: "flex-start",
            opacity: fadeIn(frame, i * 16 + 16, 18),
            transform: `translateY(${interpolate(
              spring({ frame: frame - (i * 16 + 16), fps, config: { damping: 14, stiffness: 75 } }),
              [0, 1],
              [55, 0]
            )}px)`,
            padding: "22px 26px",
            borderRadius: 22,
            background: "rgba(255,255,255,0.055)",
            border: `1px solid ${ACCENT2}28`,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              flexShrink: 0,
              borderRadius: 14,
              background: `linear-gradient(135deg, ${ACCENT2}28, ${ACCENT}18)`,
              border: `1px solid ${ACCENT2}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: ACCENT2,
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            {num}
          </div>
          <div>
            <div style={{ color: TEXT, fontSize: 32, fontWeight: 700, letterSpacing: -0.3, marginBottom: 6 }}>
              {title}
            </div>
            <div style={{ color: MUTED, fontSize: 25, lineHeight: 1.45 }}>{desc}</div>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ─── Section 5 · Testimonial (12–15s = frames 360–450) ───────────────────────
const TestimonialSection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const quoteSlide = spring({ frame, fps, config: { damping: 13, stiffness: 60 } });
  const quoteY = interpolate(quoteSlide, [0, 1], [70, 0]);
  const opacity = fadeIn(frame, 0, 22);
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
        <div style={{ color: ACCENT, fontSize: 52, marginBottom: 24, letterSpacing: 4 }}>
          ★★★★★
        </div>

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
              fontSize: 35,
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

        <div style={{ color: MUTED, fontSize: 28, fontWeight: 600 }}>
          — Marissa, 58 · Mobility & Stiffness
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 6 · CTA (15–20s = frames 450–600) ───────────────────────────────
const CTASection: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const scaleProgress = spring({ frame, fps, config: { damping: 12, stiffness: 65 } });
  const scale = interpolate(scaleProgress, [0, 1], [0.88, 1]);
  const opacity = fadeIn(frame, 0, 22);

  const glow = interpolate(Math.sin((frame / 30) * Math.PI), [-1, 1], [0.5, 1.0]);

  const offerings = [
    { icon: "⚡", label: "PEMF Sessions", color: ACCENT },
    { icon: "🧬", label: "Peptide Protocols", color: ACCENT3 },
    { icon: "🌿", label: "Health Coaching", color: ACCENT2 },
  ];

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 60px",
        gap: 28,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
        textAlign: "center",
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <div>
        <p
          style={{
            color: ACCENT,
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 3,
            margin: "0 0 12px",
            textTransform: "uppercase",
          }}
        >
          Ready to start?
        </p>
        <h2
          style={{
            color: TEXT,
            fontSize: 70,
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

      {/* Service chips */}
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        {offerings.map(({ icon, label, color }) => (
          <div
            key={label}
            style={{
              padding: "12px 22px",
              borderRadius: 999,
              background: `${color}18`,
              border: `1px solid ${color}44`,
              color,
              fontSize: 26,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {icon} {label}
          </div>
        ))}
      </div>

      {/* Location card */}
      <div
        style={{
          padding: "26px 34px",
          borderRadius: 24,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          width: "100%",
        }}
      >
        <div style={{ color: TEXT, fontSize: 30, fontWeight: 700 }}>
          Iron Butterfly Coaching
        </div>
        <div style={{ color: MUTED, fontSize: 25, marginTop: 8, lineHeight: 1.5 }}>
          📍 Costa Mesa CA 92626
          <br />
          Free intro session · No pressure · 1-on-1
        </div>
      </div>

      {/* CTA Button */}
      <div
        style={{
          padding: "30px 60px",
          borderRadius: 999,
          background: `linear-gradient(135deg, rgba(121,242,192,0.95), rgba(107,167,255,0.95))`,
          color: "#041019",
          fontSize: 38,
          fontWeight: 800,
          letterSpacing: -0.5,
          boxShadow: `0 20px 70px rgba(107,167,255,${0.25 * glow}), 0 16px 55px rgba(121,242,192,${0.20 * glow})`,
          width: "100%",
        }}
      >
        cal.com/sabrinafan →
      </div>

      <p
        style={{
          color: "rgba(234,242,255,0.38)",
          fontSize: 21,
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        Wellness support. Not medical advice. Individual results vary.
      </p>
    </AbsoluteFill>
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────
// Total: 600 frames at 30fps = 20 seconds
//
// 0–60    (0–2s)   Intro: brand + three service pills
// 60–180  (2–6s)   Services overview: 3 cards
// 180–270 (6–9s)   Peptide spotlight
// 270–360 (9–12s)  Coaching spotlight
// 360–450 (12–15s) Testimonial
// 450–600 (15–20s) CTA

export const IronButterflyAd: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: BG_DARK }}>
      <Background />
      <FloatingOrbs frame={frame} />

      <Sequence from={0} durationInFrames={60}>
        <IntroSection frame={frame} fps={fps} />
      </Sequence>

      <Sequence from={60} durationInFrames={120}>
        <ServicesSection frame={frame - 60} fps={fps} />
      </Sequence>

      <Sequence from={180} durationInFrames={90}>
        <PeptideSection frame={frame - 180} fps={fps} />
      </Sequence>

      <Sequence from={270} durationInFrames={90}>
        <CoachingSection frame={frame - 270} fps={fps} />
      </Sequence>

      <Sequence from={360} durationInFrames={90}>
        <TestimonialSection frame={frame - 360} fps={fps} />
      </Sequence>

      <Sequence from={450} durationInFrames={150}>
        <CTASection frame={frame - 450} fps={fps} />
      </Sequence>
    </AbsoluteFill>
  );
};
