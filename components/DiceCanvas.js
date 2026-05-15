'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export default function DiceCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    let app;

    async function setup() {
      app = new PIXI.Application();

      await app.init({
        width: 900,
        height: 300,
        backgroundAlpha: 0,
        antialias: true
      });

      containerRef.current.appendChild(app.canvas);

      // LOAD ASSETS
      const trackTexture = await PIXI.Assets.load('/slider-track.png');
      const bubbleTexture = await PIXI.Assets.load('/indicator.png');
      const glowTexture = await PIXI.Assets.load('/glow.png');

      // GLOW
      const glow = new PIXI.Sprite(glowTexture);

      glow.anchor.set(0.5);
      glow.x = 450;
      glow.y = 150;

      glow.width = 500;
      glow.height = 120;

      glow.alpha = 0.6;

      app.stage.addChild(glow);

      // TRACK
      const track = new PIXI.Sprite(trackTexture);

      track.anchor.set(0.5);
      track.x = 450;
      track.y = 150;

      track.width = 700;
      track.height = 80;

      app.stage.addChild(track);

      // INDICATOR
      const bubble = new PIXI.Sprite(bubbleTexture);

      bubble.anchor.set(0.5);

      bubble.x = 450;
      bubble.y = 110;

      bubble.width = 120;
      bubble.height = 120;

      app.stage.addChild(bubble);

      // FLOAT ANIMATION
      app.ticker.add(() => {
        bubble.y = 110 + Math.sin(Date.now() * 0.003) * 5;
      });
    }

    setup();

    return () => {
      if (app) {
        app.destroy(true, true);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}
    />
  );
                     }
