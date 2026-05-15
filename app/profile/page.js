'use client';

import { useEffect, useState } from 'react';
import BottomNav from '../../components/BottomNav';

export default function ProfilePage() {
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

  const balance = Number(user?.balance ?? 0);

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>👤 Profile</h1>

      <div style={styles.card}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>{tgUser.first_name?.[0] || '?'}</div>
          <div>
            <div style={styles.username}>{tgUser.first_name} {tgUser.last_name || ''}</div>
            <div style={styles.userid}>@{tgUser.username || 'User'}</div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.stat}>
          <span>Balance</span>
          <b>{balance.toFixed(2)}</b>
        </div>
      </div>

      <div style={styles.card}>
        <h3>Account Settings</h3>
        <p style={styles.comingSoon}>Settings coming soon</p>
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
  avatarSection: {
    display: 'flex',
    gap: 16,
    alignItems: 'center'
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #118cff, #23bfff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 900
  },
  username: {
    fontSize: 16,
    fontWeight: 800,
    marginBottom: 4
  },
  userid: {
    color: '#8fa6b8',
    fontSize: 13
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  comingSoon: {
    color: '#8fa6b8',
    margin: 0
  }
};
