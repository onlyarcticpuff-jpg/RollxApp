'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export default function DiceCanvas({ roll = 50.5, target = 50.5, condition = 'over', result = null }) {
  const containerRef = useRef(null);
  const stateRef = useRef({ roll, target, condition, result });

  useEffect(() => {
    stateRef.current = { roll, target, condition, result };
  }, [roll, target, condition, result]);

  useEffect(() => {
    let app;
    let knob;
    let bubble;
    let bubbleText;
    let currentX = 0;

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

      const trackX = 34;
      const trackW = width - 68;
      const trackY = 135;
      const trackH = 34;

      const getX = (value) => trackX + (Number(value) / 100) * trackW;
      currentX = getX(target);

      const bg = new PIXI.Graphics();
      bg.roundRect(trackX, trackY - trackH / 2, trackW, trackH, 18);
      bg.fill('#233846');
      app.stage.addChild(bg);

      const inner = new PIXI.Graphics();
      inner.roundRect(trackX + 10, trackY - 8, trackW - 20, 16, 8);
      inner.fill('#07141c');
      app.stage.addChild(inner);

      const red = new PIXI.Graphics();
      red.roundRect(trackX + 14, trackY - 5, getX(target) - trackX - 14, 10, 5);
      red.fill('#ff174f');
      app.stage.addChild(red);

      const green = new PIXI.Graphics();
      green.roundRect(getX(target), trackY - 5, trackX + trackW - getX(target) - 14, 10, 5);
      green.fill('#00e91f');
      app.stage.addChild(green);

      [0, 25, 50, 75, 100].forEach((num) => {
        const x = getX(num);

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

      bubble = new PIXI.Graphics();
      app.stage.addChild(bubble);

      bubbleText = new PIXI.Text({
        text: Number(roll).toFixed(2),
        style: {
          fill: '#00ff38',
          fontSize: 14,
          fontWeight: '900',
          fontFamily: 'Arial'
        }
      });
      bubbleText.anchor.set(0.5);
      app.stage.addChild(bubbleText);

      knob = new PIXI.Graphics();
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
      app.stage.addChild(knobLines);

      function drawAt(x) {
        const isWin = stateRef.current.result === 'win';
        const color = isWin ? '#00ff38' : stateRef.current.result === 'loss' ? '#ff174f' : '#ffffff';

        knob.clear();
        knob.roundRect(x - 22, trackY - 22, 44, 44, 10);
        knob.fill('#139cf2');
        knob.stroke({ width: 3, color: '#23bfff' });

        knobLines.x = x;
        knobLines.y = trackY;

        bubble.clear();
        bubble.roundRect(x - 38, 42, 76, 34, 17);
        bubble.fill('#101b24');
        bubble.stroke({ width: 2, color: isWin ? '#00ff38' : '#37566a' });

        bubbleText.text = Number(stateRef.current.roll).toFixed(2);
        bubbleText.style.fill = color;
        bubbleText.x = x;
        bubbleText.y = 59;
      }

      drawAt(currentX);

      app.ticker.add(() => {
        const wantedX = getX(stateRef.current.roll || stateRef.current.target);
        currentX += (wantedX - currentX) * 0.08;
        drawAt(currentX);
      });
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
