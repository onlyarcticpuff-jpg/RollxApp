'use client';

import { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

const lastTickRef = useRef(null);
const soundsRef = useRef({});

export default function DiceCanvas({
  target = 50.5,
  onTargetChange,
  roll,
  result,
  rollKey
}) {
  const containerRef = useRef(null);
  const refs = useRef({});

  useEffect(() => {
    if (!refs.current?.setTargetVisual) return;
    refs.current.setTargetVisual(target);
  }, [target]);

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

      const getValueFromX = (x) => {
        const clampedX = Math.max(trackX, Math.min(trackX + trackW, x));
        const raw = ((clampedX - trackX) / trackW) * 100;

        // keep sane limits so multiplier doesn’t go insane
        return Math.min(98, Math.max(2, Number(raw.toFixed(2))));
      };

      let currentTarget = target;
      let targetX = getX(currentTarget);

      const bg = new PIXI.Graphics();
      app.stage.addChild(bg);

      const inner = new PIXI.Graphics();
      app.stage.addChild(inner);

      const red = new PIXI.Graphics();
      app.stage.addChild(red);

      const green = new PIXI.Graphics();
      app.stage.addChild(green);

      const drawTrack = () => {
        targetX = getX(currentTarget);

        bg.clear();
        bg.roundRect(trackX, trackY - trackH / 2, trackW, trackH, 18);
        bg.fill('#233846');

        inner.clear();
        inner.roundRect(trackX + 10, trackY - 8, trackW - 20, 16, 8);
        inner.fill('#07141c');

        red.clear();
        red.roundRect(trackX + 14, trackY - 5, targetX - trackX - 14, 10, 5);
        red.fill('#ff174f');

        green.clear();
        green.roundRect(targetX, trackY - 5, trackX + trackW - targetX - 14, 10, 5);
        green.fill('#00e91f');
      };

      drawTrack();

      for (let num = 0; num <= 100; num += 5) {
        const x = getX(num);

        const tick = new PIXI.Graphics();
        tick.moveTo(x, 98);
        tick.lineTo(x, num % 25 === 0 ? 108 : 103);
        tick.stroke({
          width: num % 25 === 0 ? 2 : 1,
          color: '#2d4656',
          alpha: num % 25 === 0 ? 1 : 0.65
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
      app.stage.addChild(knobLines);

      const targetText = new PIXI.Text({
        text: currentTarget.toFixed(2),
        style: {
          fill: '#ffffff',
          fontSize: 12,
          fontWeight: '900',
          fontFamily: 'Arial'
        }
      });

      targetText.anchor.set(0.5);
      app.stage.addChild(targetText);

      const drawKnob = () => {
        targetX = getX(currentTarget);

        knob.clear();
        knob.roundRect(targetX - 22, trackY - 22, 44, 44, 10);
        knob.fill('#139cf2');
        knob.stroke({ width: 3, color: '#23bfff' });

        knobLines.x = targetX;
        knobLines.y = trackY;

        targetText.text = currentTarget.toFixed(2);
        targetText.x = targetX;
        targetText.y = trackY + 42;
      };

      drawKnob();

      // invisible drag hitbox, because tiny knob dragging is annoying on mobile
      const hitbox = new PIXI.Graphics();
      hitbox.roundRect(trackX - 8, trackY - 34, trackW + 16, 68, 22);
      hitbox.fill({ color: '#ffffff', alpha: 0.001 });
      hitbox.eventMode = 'static';
      hitbox.cursor = 'pointer';
      app.stage.addChild(hitbox);

      let dragging = false;

      const updateFromPointer = (event) => {
        const pos = event.global;
        const value = getValueFromX(pos.x);

        currentTarget = value;
        drawTrack();
        drawKnob();

        if (onTargetChange) {
          onTargetChange(value);
        }
      };

      hitbox.on('pointerdown', (event) => {
        dragging = true;
        updateFromPointer(event);
      });

      hitbox.on('pointermove', (event) => {
        if (!dragging) return;
        updateFromPointer(event);
      });

      hitbox.on('pointerup', () => {
        dragging = false;
      });

      hitbox.on('pointerupoutside', () => {
        dragging = false;
      });

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
        frame: 0,
        setTargetVisual: (newTarget) => {
          currentTarget = Number(newTarget);
          drawTrack();
          drawKnob();
          refs.current.targetX = getX(currentTarget);
        }
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

// connected pin bubble shape
r.bubble.clear();

const x = r.currentX;
const y = 38;
const w = 74;
const h = 34;
const radius = 17;
const pointH = 13;

r.bubble.moveTo(x - w / 2 + radius, y);
r.bubble.lineTo(x + w / 2 - radius, y);
r.bubble.quadraticCurveTo(x + w / 2, y, x + w / 2, y + radius);
r.bubble.lineTo(x + w / 2, y + h - radius);
r.bubble.quadraticCurveTo(x + w / 2, y + h, x + w / 2 - radius, y + h);

r.bubble.lineTo(x + 9, y + h);
r.bubble.lineTo(x, y + h + pointH);
r.bubble.lineTo(x - 9, y + h);

r.bubble.lineTo(x - w / 2 + radius, y + h);
r.bubble.quadraticCurveTo(x - w / 2, y + h, x - w / 2, y + h - radius);
r.bubble.lineTo(x - w / 2, y + radius);
r.bubble.quadraticCurveTo(x - w / 2, y, x - w / 2 + radius, y);
r.bubble.closePath();

r.bubble.fill('#101b24');
r.bubble.stroke({ width: 2, color: strokeColor });
r.bubble.alpha = r.opacity;

r.bubbleText.text = Number(r.finalRoll).toFixed(2);
r.bubbleText.style.fill = textColor;
r.bubbleText.x = r.currentX;
r.bubbleText.y = 54;
r.bubbleText.alpha = r.opacity;
      });
    }

    setup();
    
soundsRef.current = {
  tick: new Audio('/sounds/tick.mp3'),
  win: new Audio('/sounds/win.mp3'),
  lose: new Audio('/sounds/win.mp3')
};

soundsRef.current.tick.volume = 0.25;
soundsRef.current.win.volume = 0.45;
soundsRef.current.lose.volume = 0.35;
    return () => {
      if (app) app.destroy(true, true);
    };
  }, []);

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
