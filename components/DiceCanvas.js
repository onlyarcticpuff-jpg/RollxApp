'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export default function DiceCanvas() {
  const containerRef = useRef(null);

  useEffect(() => {
    let app;

    async function setup() {
      const width = Math.min(window.innerWidth, 430);
      const height = 240;

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

      const bubbleTexture = await PIXI.Assets.load('/indicator.png');

      const centerX = width / 2;
      const trackX = 34;
      const trackW = width - 68;
      const trackY = 135;
      const trackH = 34;

      const trackBg = new PIXI.Graphics();
      trackBg.roundRect(trackX, trackY - trackH / 2, trackW, trackH, 18);
      trackBg.fill('#233846');
      app.stage.addChild(trackBg);

      const inner = new PIXI.Graphics();
      inner.roundRect(trackX + 10, trackY - 8, trackW - 20, 16, 8);
      inner.fill('#07141c');
      app.stage.addChild(inner);

      const splitX = trackX + trackW * 0.505;

      const red = new PIXI.Graphics();
      red.roundRect(trackX + 14, trackY - 5, splitX - trackX - 14, 10, 5);
      red.fill('#ff174f');
      app.stage.addChild(red);

      const green = new PIXI.Graphics();
      green.roundRect(splitX, trackY - 5, trackX + trackW - splitX - 14, 10, 5);
      green.fill('#00e91f');
      app.stage.addChild(green);

      [0, 25, 50, 75, 100].forEach((num) => {
        const x = trackX + (num / 100) * trackW;

        const label = new PIXI.Text({
          text: String(num),
          style: {
            fill: '#ffffff',
            fontSize: 16,
            fontWeight: '700',
            fontFamily: 'Arial'
          }
        });

        label.anchor.set(0.5);
        label.x = x;
        label.y = 70;
        app.stage.addChild(label);

        const tick = new PIXI.Graphics();
        tick.moveTo(x, 94);
        tick.lineTo(x, 105);
        tick.stroke({ width: 2, color: '#2d4656' });
        app.stage.addChild(tick);
      });

      const bubble = new PIXI.Sprite(bubbleTexture);
      bubble.anchor.set(0.5);
      bubble.x = splitX;
      bubble.y = 88;
      bubble.width = 54;
      bubble.height = 54;
      app.stage.addChild(bubble);

      const resultText = new PIXI.Text({
        text: '50.50',
        style: {
          fill: '#00ff38',
          fontSize: 14,
          fontWeight: '900',
          fontFamily: 'Arial'
        }
      });

      resultText.anchor.set(0.5);
      resultText.x = splitX;
      resultText.y = 88;
      app.stage.addChild(resultText);

      const knob = new PIXI.Graphics();
      knob.roundRect(0, 0, 44, 44, 10);
      knob.fill('#139cf2');
      knob.stroke({ width: 3, color: '#23bfff' });
      knob.x = splitX - 22;
      knob.y = trackY - 22;
      app.stage.addChild(knob);

      const knobLines = new PIXI.Text({
        text: '|||',
        style: {
          fill: '#0b6fb8',
          fontSize: 16,
          fontWeight: '900',
          fontFamily: 'Arial'
        }
      });

      knobLines.anchor.set(0.5);
      knobLines.x = splitX;
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
        paddingTop: 24
      }}
    />
  );
}
