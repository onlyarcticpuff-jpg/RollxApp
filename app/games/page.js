'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BottomNav from '../../components/BottomNav';

export default function GamesPage() {
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    const telegramUser = tg?.initDataUnsafe?.user;
    if (!telegramUser?.id) return;

    setTgUser(telegramUser);
  }, []);

  if (!tgUser) {
    return (
      <main style={styles.page}>
        <h1>RollX</h1>
        <p>Open this inside Telegram.</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>🎮 Games</h1>

      <section style={styles.grid}>
        <GameCard href="/games/dice" icon="🎲" title="Dice" status="Live" description="Roll the dice" />
        <GameCard href="/games/crash" icon="🚀" title="Crash" status="Live" description="Catch the rocket" />
        <GameCard href="/games/cases" icon="📦" title="Cases" status="Soon" description="Open mystery cases" />
        <GameCard href="/games/mines" icon="💣" title="Mines" status="Soon" description="Avoid the mines" />
      </section>

      <BottomNav />
    </main>
  );
}

function GameCard({ href, icon, title, status, description }) {
  return (
    <Link href={href} style={styles.gameCard}>
      <div style={styles.gameIcon}>{icon}</div>
      <b style={styles.gameTitle}>{title}</b>
      <p style={styles.gameDesc}>{description}</p>
      <span style={{...styles.status, ...(status === 'Live' ? styles.statusLive : styles.statusSoon)}}>
        {status}
      </span>
    </Link>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#080d16',
    color: 'white',
    padding: '18px 18px 100px',
    fontFamily: 'system-ui'
  },
  title: {
    margin: 0,
    fontSize: 34,
    marginBottom: 20
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 20
  },
  gameCard: {
    background: 'linear-gradient(135deg, #101b27, #0d1520)',
    border: '1px solid #24384d',
    borderRadius: 18,
    padding: 16,
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    transition: 'transform 0.2s',
    cursor: 'pointer'
  },
  gameIcon: {
    fontSize: 36
  },
  gameTitle: {
    fontSize: 16,
    margin: 0
  },
  gameDesc: {
    fontSize: 12,
    color: '#8fa6b8',
    margin: 0
  },
  status: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 800,
    marginTop: 4,
    width: 'fit-content'
  },
  statusLive: {
    background: '#00ff38',
    color: '#000'
  },
  statusSoon: {
    background: '#294357',
    color: '#fff'
  }
};
