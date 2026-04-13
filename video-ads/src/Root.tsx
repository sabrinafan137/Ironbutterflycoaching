import React from "react";
import { Composition } from "remotion";
import { IronButterflyAd } from "./compositions/IronButterflyAd";

// Total duration: 600 frames at 30fps = 20 seconds
const DURATION_IN_FRAMES = 600;
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Square / 1:1 version (Instagram feed) */}
      <Composition
        id="IronButterflyAd"
        component={IronButterflyAd}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1080}
      />

      {/* Vertical / 9:16 version (Instagram Reels, TikTok, Stories) */}
      <Composition
        id="IronButterflyAd-Vertical"
        component={IronButterflyAd}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* Landscape / 16:9 version (YouTube, Facebook) */}
      <Composition
        id="IronButterflyAd-Landscape"
        component={IronButterflyAd}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
