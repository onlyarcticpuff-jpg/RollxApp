'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

export default function DiceCanvas({ target = 50.5, roll, result, rollKey }) {
  const containerRef = useRef(null);
  const refs = useRef({});

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

      const trackX = 34;
      const trackW = width - 68;
      const trackY = 135;
      const trackH = 34;

      const getX = (value) => trackX + (Number(value) / 100) * trackW;
      const targetX = getX(target);

      const bg = new PIXI.Graphics();
      bg.roundRect(trackX, trackY - trackH / 2, trackW, trackH, 18);
      bg.fill('#233846');
      app.stage.addChild(bg);

      const inner = new PIXI.Graphics();
      inner.roundRect(trackX + 10, trackY - 8, trackW - 20, 16, 8);
      inner.fill('#07141c');
      app.stage.addChild(inner);

      const red = new PIXI.Graphics();
      red.roundRect(trackX + 14, trackY - 5, targetX - trackX - 14, 10, 5);
      red.fill('#ff174f');
      app.stage.addChild(red);

      const green = new PIXI.Graphics();
      green.roundRect(targetX, trackY - 5, trackX + trackW - targetX - 14, 10, 5);
      green.fill('#00e91f');
      app.stage.addChild(green);

      for (let num = 0; num <= 100; num += 5) {
        const x = getX(num);

        const tick = new PIXI.Graphics();
        tick.moveTo(x, 98);
        tick.lineTo(x, num % 25 === 0 ? 108 : 103);
        tick.stroke({
          width: num % 25 === 0 ? 2 : 1,
          color: '#2d4656'
        });
        app.stage.addChild(tick);

        if (num % 25 === 0) {
          const label = new PIXI.Text({
            text: String(num),
            style: {
              fill: '#ffffff',
              fontSize: 13,
              fontWeight: '700',
              fontFamily: 'Arial'
            }
          });

          label.anchor.set(0.5);
          label.x = x;
          label.y = 72;
          app.stage.addChild(label);
        }
      }

      const knob = new PIXI.Graphics();
      knob.roundRect(targetX - 22, trackY - 22, 44, 44, 10);
      knob.fill('#139cf2');
      knob.stroke({ width: 3, color: '#23bfff' });
      app.stage.addChild(knob);

      const knobLines = new PIXI.Text({
        text: '|||',
        style: {
          fill: '#0b6fb8',
          fontSize: 14,
          fontWeight: '900',
          fontFamily: 'Arial'
        }
      });

      knobLines.anchor.set(0.5);
      knobLines.x = targetX;
      knobLines.y = trackY;
      app.stage.addChild(knobLines);

      const bubble = new PIXI.Graphics();
      bubble.alpha = 0;
      app.stage.addChild(bubble);

      const bubbleText = new PIXI.Text({
        text: '',
        style: {
          fill: '#ffffff',
          fontSize: 13,
          fontWeight: '900',
          fontFamily: 'Arial'
        }
      });

      bubbleText.anchor.set(0.5);
      bubbleText.alpha = 0;
      app.stage.addChild(bubbleText);

      refs.current = {
        app,
        getX,
        bubble,
        bubbleText,
        currentX: targetX,
        targetX,
        animating: false,
        phase: 'idle',
        opacity: 0,
        finalX: targetX,
        finalRoll: null,
        result: null,
        frame: 0
      };

      app.ticker.add(() => {
        const r = refs.current;
        if (!r.animating) return;

        r.frame++;

        r.currentX += (r.finalX - r.currentX) * 0.085;

        if (r.phase === 'in') {
          r.opacity += 0.08;
          if (r.opacity >= 1) {
            r.opacity = 1;
            r.phase = 'hold';
            r.frame = 0;
          }
        } else if (r.phase === 'hold') {
          if (r.frame > 55) {
            r.phase = 'out';
          }
        } else if (r.phase === 'out') {
          r.opacity -= 0.045;
          if (r.opacity <= 0) {
            r.opacity = 0;
            r.animating = false;
          }
        }

        const isWin = r.result === 'win';
        const strokeColor = isWin ? '#00ff38' : '#ff174f';
        const textColor = isWin ? '#00ff38' : '#ff174f';

        r.bubble.clear();
        r.bubble.roundRect(r.currentX - 38, 42, 76, 34, 17);
        r.bubble.fill('#101b24');
        r.bubble.stroke({ width: 2, color: strokeColor });
        r.bubble.alpha = r.opacity;

        r.bubbleText.text = Number(r.finalRoll).toFixed(2);
        r.bubbleText.style.fill = textColor;
        r.bubbleText.x = r.currentX;
        r.bubbleText.y = 59;
        r.bubbleText.alpha = r.opacity;
      });
    }

    setup();

    return () => {
      if (app) app.destroy(true, true);
    };
  }, [target]);

  useEffect(() => {
    if (!roll || !refs.current?.getX) return;

    const r = refs.current;

    r.currentX = r.targetX;
    r.finalX = r.getX(roll);
    r.finalRoll = roll;
    r.result = result;
    r.opacity = 0;
    r.phase = 'in';
    r.frame = 0;
    r.animating = true;
  }, [rollKey]);

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
