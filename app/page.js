'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [tgUser, setTgUser] = useState(null);
  const [user, setUser] = useState(null);
  const [bet, setBet] = useState(100);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadUser(telegramId) {
    const res = await fetch(`/api/me?telegram_id=${telegramId}`);
    const data = await res.json();
    setUser(data);
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

  async function playDice() {
    if (!tgUser?.id) return;

    setLoading(true);
    setResult(null);

    const res = await fetch('/api/games/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram_id: tgUser.id,
        game_id: 'dice',
        bet_amount: Number(bet)
      })
    });

    const data = await res.json();

    setLoading(false);

    if (data.error) {
      setResult({ error: data.error });
      return;
    }

    setResult(data);
    await loadUser(tgUser.id);
  }

  if (!tgUser) {
    return (
      <main style={styles.page}>
        <h1>🎲 RollX</h1>
        <p>Open this inside Telegram.</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <h1>🎲 RollX</h1>

      <div style={styles.card}>
        <p>Welcome, {user?.first_name || tgUser.first_name}</p>
        <h2>{Number(user?.balance || 0).toFixed(2)} credits</h2>
      </div>

      <div style={styles.card}>
        <h2>Dice Roll</h2>
        <p>Roll over 50. Win 1.98x.</p>

        <input
          style={styles.input}
          type="number"
          value={bet}
          onChange={(e) => setBet(e.target.value)}
        />

        <button style={styles.button} onClick={playDice} disabled={loading}>
          {loading ? 'Rolling...' : '🎲 Roll Dice'}
        </button>
      </div>

      {result && (
        <div style={styles.card}>
          {result.error ? (
            <h3>⚠️ {result.error}</h3>
          ) : (
            <>
              <h2>{result.result === 'win' ? '🔥 WIN' : '💀 LOSS'}</h2>
              <p>Roll: {result.roll}</p>
              <p>Profit: {Number(result.profit).toFixed(2)}</p>
              <p>New Balance: {Number(result.balance).toFixed(2)}</p>
            </>
          )}
        </div>
      )}
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#101018',
    color: 'white',
    padding: 20,
    fontFamily: 'system-ui'
  },
  card: {
    background: '#1b1b28',
    borderRadius: 20,
    padding: 18,
    marginTop: 16
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    border: 'none',
    fontSize: 18,
    marginTop: 10
  },
  button: {
    width: '100%',
    padding: 16,
    borderRadius: 16,
    border: 'none',
    marginTop: 14,
    fontWeight: 800,
    fontSize: 16
  }
};
