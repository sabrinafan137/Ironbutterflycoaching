import React from "react";
import { Composition } from "remotion";
import { IronButterflyAd } from "./compositions/IronButterflyAd";
import { IronButterflyReel } from "./compositions/IronButterflyReel";
import { IronButterflyReel2 } from "./compositions/IronButterflyReel2";

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ── Evergreen brand ad ── */}
      <Composition
        id="IronButterflyAd"
        component={IronButterflyAd}
        durationInFrames={600}
        fps={FPS}
        width={1080}
        height={1080}
      />
      <Composition
        id="IronButterflyAd-Vertical"
        component={IronButterflyAd}
        durationInFrames={600}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="IronButterflyAd-Landscape"
        component={IronButterflyAd}
        durationInFrames={600}
        fps={FPS}
        width={1920}
        height={1080}
      />

      {/* ── Talking-head reel · Hook A: "You're not tired. You're DEPLETED." ── */}
      <Composition
        id="IronButterflyReel-HookA"
        component={IronButterflyReel}
        durationInFrames={510}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* ── Talking-head reel · Hook B: "Doctors won't tell you this." ── */}
      <Composition
        id="IronButterflyReel-HookB"
        component={IronButterflyReel2}
        durationInFrames={450}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
