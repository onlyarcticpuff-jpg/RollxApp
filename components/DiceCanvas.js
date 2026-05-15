'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export default function DiceCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    let app;

    async function setup() {
      const width = Math.min(window.innerWidth, 430);
      const height = 260;

      app = new PIXI.Application();

      await app.init({
        width,
        height,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      });

      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(app.canvas);

      const trackTexture = await PIXI.Assets.load('/slider-track.png');
      const bubbleTexture = await PIXI.Assets.load('/indicator.png');
      const glowTexture = await PIXI.Assets.load('/glow.png');

      const centerX = width / 2;
      const trackY = 150;

      const glow = new PIXI.Sprite(glowTexture);
      glow.anchor.set(0.5);
      glow.x = centerX;
      glow.y = trackY;
      glow.width = 260;
      glow.height = 90;
      glow.alpha = 0.45;
      app.stage.addChild(glow);

      const labels = [0, 25, 50, 75, 100];

      labels.forEach((num) => {
        const x = 42 + (num / 100) * (width - 84);

        const text = new PIXI.Text({
          text: String(num),
          style: {
            fill: '#ffffff',
            fontSize: 20,
            fontWeight: '700',
            fontFamily: 'Arial'
          }
        });

        text.anchor.set(0.5);
        text.x = x;
        text.y = 78;
        app.stage.addChild(text);
      });

      const track = new PIXI.Sprite(trackTexture);
      track.anchor.set(0.5);
      track.x = centerX;
      track.y = trackY;
      track.width = width - 42;
      track.height = 34;
      app.stage.addChild(track);

      const bubble = new PIXI.Sprite(bubbleTexture);
      bubble.anchor.set(0.5);
      bubble.x = centerX;
      bubble.y = 112;
      bubble.width = 70;
      bubble.height = 70;
      app.stage.addChild(bubble);

      const resultText = new PIXI.Text({
        text: '50.50',
        style: {
          fill: '#0cff3a',
          fontSize: 17,
          fontWeight: '900',
          fontFamily: 'Arial'
        }
      });

      resultText.anchor.set(0.5);
      resultText.x = bubble.x;
      resultText.y = bubble.y - 1;
      app.stage.addChild(resultText);

      const knob = new PIXI.Graphics();
      knob.roundRect(0, 0, 46, 46, 10);
      knob.fill('#139cf2');
      knob.stroke({ width: 3, color: '#1fc0ff' });
      knob.x = centerX - 23;
      knob.y = trackY - 23;
      app.stage.addChild(knob);

      const knobLines = new PIXI.Text({
        text: '|||',
        style: {
          fill: '#0b6fb8',
          fontSize: 20,
          fontWeight: '900',
          fontFamily: 'Arial'
        }
      });

      knobLines.anchor.set(0.5);
      knobLines.x = centerX;
      knobLines.y = trackY;
      app.stage.addChild(knobLines);
    }

    setup();

    return () => {
      if (app) app.destroy(true, true);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 30
      }}
    />
  );
}
