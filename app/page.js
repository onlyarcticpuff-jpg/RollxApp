'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BottomNav from '../components/BottomNav';

export default function Home() {
  const [tgUser, setTgUser] = useState(null);
  const [user, setUser] = useState(null);

  async function loadUser(telegramId) {
    const res = await fetch(`/api/me?telegram_id=${telegramId}`);
    const data = await res.json();
    if (!data.error) setUser(data);
  }

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    const telegramUser = tg?.initDataUnsafe?.user;
    if (!telegramUser?.id) return;

    setTgUser(telegramUser);
    loadUser(telegramUser.id);
  }, []);

  if (!tgUser) {
    return (
      <main style={styles.page}>
        <h1>RollX</h1>
        <p>Open this inside Telegram.</p>
      </main>
    );
  }

  const balance = Number(user?.balance || 0);

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Welcome back</p>
          <h1 style={styles.title}>RollX</h1>
        </div>

        <div style={styles.balance}>
          <span style={styles.balanceLabel}>Balance</span>
          <b>{balance.toFixed(2)}</b>
        </div>
      </section>

      <section style={styles.hero}>
        <div>
          <p style={styles.heroLabel}>Featured</p>
          <h2 style={styles.heroTitle}>Dice is live 🎲</h2>
          <p style={styles.heroText}>
            Slide your odds, place a bet, and roll with 99% RTP.
          </p>
        </div>

        <Link href="/games/dice" style={styles.heroButton}>
          Play Now
        </Link>
      </section>

      <section style={styles.grid}>
        <GameCard href="/games/dice" icon="🎲" title="Dice" status="Live" />
        <GameCard href="/games/cases" icon="📦" title="Cases" status="Soon" />
        <GameCard href="/games/rocket" icon="🚀" title="Rocket" status="Soon" />
        <GameCard href="/games/mines" icon="💣" title="Mines" status="Soon" />
      </section>

      <section style={styles.card}>
        <h3>Daily Bonus</h3>
        <p>Rewards system coming soon.</p>
      </section>

      <BottomNav />
    </main>
  );
}

function GameCard({ href, icon, title, status }) {
  return (
    <Link href={href} style={styles.gameCard}>
      <div style={styles.gameIcon}>{icon}</div>
      <b>{title}</b>
      <span>{status}</span>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  eyebrow: {
    margin: 0,
    color: '#8fa6b8',
    fontSize: 13,
    fontWeight: 800
  },
  title: {
    margin: 0,
    fontSize: 34,
    letterSpacing: -1
  },
  balance: {
    background: '#111c2a',
    border: '1px solid #294357',
    borderRadius: 18,
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  balanceLabel: {
    color: '#8fa6b8',
    fontSize: 11,
    fontWeight: 800
  },
  hero: {
    marginTop: 22,
    background: 'linear-gradient(135deg, #12263a, #101827)',
    border: '1px solid #284766',
    borderRadius: 28,
    padding: 20,
    minHeight: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: '0 18px 50px rgba(0,0,0,0.25)'
  },
  heroLabel: {
    margin: 0,
    color: '#23bfff',
    fontWeight: 900,
    fontSize: 12
  },
  heroTitle: {
    margin: '6px 0',
    fontSize: 26
  },
  heroText: {
    margin: 0,
    color: '#a8bac9',
    fontSize: 14
  },
  heroButton: {
    marginTop: 18,
    background: '#118cff',
    color: 'white',
    textDecoration: 'none',
    textAlign: 'center',
    borderRadius: 16,
    padding: 15,
    fontWeight: 900
  },
  grid: {
    marginTop: 18,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12
  },
  gameCard: {
    background: '#101b27',
    border: '1px solid #24384d',
    borderRadius: 22,
    padding: 16,
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  gameIcon: {
    fontSize: 32
  },
  card: {
    marginTop: 18,
    background: '#101b27',
    border: '1px solid #24384d',
    borderRadius: 22,
    padding: 16,
    color: '#a8bac9'
  }
};
