'use client';

import { useEffect, useState } from 'react';
import BottomNav from '../../components/BottomNav';

export default function RewardsPage() {
  const [tgUser, setTgUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    const telegramUser = tg?.initDataUnsafe?.user;
    if (telegramUser?.id) {
      setTgUser(telegramUser);
    }
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
      <h1 style={styles.title}>🎁 Rewards</h1>

      <div style={styles.card}>
        <h3>Daily Bonus</h3>
        <p style={styles.comingSoon}>Coming Soon</p>
      </div>

      <div style={styles.card}>
        <h3>Referral Program</h3>
        <p style={styles.comingSoon}>Invite friends and earn rewards</p>
      </div>

      <div style={styles.card}>
        <h3>Loyalty Levels</h3>
        <p style={styles.comingSoon}>Unlock perks as you play</p>
      </div>

      <BottomNav />
    </main>
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
  card: {
    background: '#101b27',
    border: '1px solid #24384d',
    borderRadius: 22,
    padding: 20,
    marginBottom: 12
  },
  comingSoon: {
    color: '#8fa6b8',
    margin: 0
  }
};
