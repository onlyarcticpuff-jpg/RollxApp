'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('Loading RollX...');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();

    const telegramUser = tg?.initDataUnsafe?.user;

    if (!telegramUser?.id) {
      setStatus('Open this inside Telegram.');
      return;
    }

    fetch(`/api/me?telegram_id=${telegramUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus(data.error);
        } else {
          setUser(data);
        }
      })
      .catch(() => setStatus('Failed to load account.'));
  }, []);

  if (!user) {
    return (
      <main style={styles.page}>
        <h1>🎲 RollX</h1>
        <p>{status}</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1>🎲 RollX</h1>

      <div style={styles.card}>
        <p>Welcome, {user.first_name || 'Player'}</p>
        <h2>{Number(user.balance).toFixed(2)} credits</h2>
        <p>Level {user.level} · {user.xp} XP</p>
      </div>

      <button style={styles.button}>🎮 Games Coming Soon</button>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#11111a',
    color: 'white',
    padding: 24,
    fontFamily: 'system-ui',
  },
  card: {
    background: '#1d1d2b',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    width: '100%',
    padding: 16,
    borderRadius: 16,
    border: 'none',
    fontWeight: 700,
    fontSize: 16,
  },
};
