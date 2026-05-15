'use client';

import { useEffect, useState } from 'react';
import DiceCanvas from '../components/DiceCanvas';

export default function Home() {
  const [tgUser, setTgUser] = useState(null);
  const [user, setUser] = useState(null);
  const [bet, setBet] = useState(100);
  const [target] = useState(50.5);
  const [result, setResult] = useState(null);
  const [rollKey, setRollKey] = useState(0);
  const [loading, setLoading] = useState(false);

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

  async function playDice() {
    if (!tgUser?.id || loading) return;

    setLoading(true);

    const res = await fetch('/api/games/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        telegram_id: tgUser.id,
        game_id: 'dice',
        bet_amount: Number(bet),
        target,
        condition: 'over'
      })
    });

    const data = await res.json();
    setLoading(false);

    if (data.error) {
      alert(data.error);
      return;
    }

    setResult(data);
    setRollKey((v) => v + 1);

    setUser((prev) => ({
      ...prev,
      balance: data.balance
    }));
  }

  if (!tgUser) {
    return (
      <main style={styles.page}>
        <h1>RollX</h1>
        <p>Open this inside Telegram.</p>
      </main>
    );
  }

  const balance = Number(user?.balance || 0);
  const winChance = 100 - target;
  const multiplier = 99 / winChance;
  const profitOnWin = Number(bet) * multiplier - Number(bet);

  return (
    <main style={styles.page}>
      <div style={styles.top}>
        <h1>RollX</h1>
        <div style={styles.balance}>{balance.toFixed(2)}</div>
      </div>

      <DiceCanvas
        target={target}
        roll={result?.roll}
        result={result?.result}
        rollKey={rollKey}
      />

      <div style={styles.panel}>
        <div style={styles.stats}>
          <div>
            <span>Multiplier</span>
            <b>{multiplier.toFixed(4)}×</b>
          </div>
          <div>
            <span>Roll Over</span>
            <b>{target.toFixed(2)}</b>
          </div>
          <div>
            <span>Win Chance</span>
            <b>{winChance.toFixed(2)}%</b>
          </div>
        </div>

        <label>Bet Amount</label>
        <input
          style={styles.input}
          type="number"
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
        />

        <div style={styles.quick}>
          <button onClick={() => setBet(Math.max(1, bet / 2))}>½</button>
          <button onClick={() => setBet(bet * 2)}>2×</button>
          <button onClick={() => setBet(balance)}>MAX</button>
        </div>

        <label>Profit on Win</label>
        <div style={styles.profit}>{profitOnWin.toFixed(2)} credits</div>

        <button style={styles.rollBtn} onClick={playDice} disabled={loading}>
          {loading ? 'Rolling...' : 'Bet'}
        </button>

        {result && (
          <div style={styles.result}>
            {result.result === 'win' ? '🔥 WIN' : '💀 LOSS'} · Roll {Number(result.roll).toFixed(2)}
          </div>
        )}
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#080d16',
    color: 'white',
    padding: 18,
    fontFamily: 'system-ui'
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  balance: {
    background: '#111c2a',
    padding: '10px 14px',
    borderRadius: 14,
    fontWeight: 800
  },
  panel: {
    background: '#101b27',
    borderRadius: 22,
    padding: 16,
    marginTop: 10
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 8,
    marginBottom: 16,
    fontSize: 12
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 14,
    border: '1px solid #294357',
    background: '#07131d',
    color: 'white',
    fontSize: 22,
    margin: '8px 0 10px',
    boxSizing: 'border-box'
  },
  quick: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: 8,
    marginBottom: 14
  },
  profit: {
    padding: 14,
    background: '#07131d',
    borderRadius: 14,
    margin: '8px 0 14px',
    color: '#00ff55',
    fontWeight: 800
  },
  rollBtn: {
    width: '100%',
    padding: 18,
    borderRadius: 18,
    border: 'none',
    background: '#118cff',
    color: 'white',
    fontSize: 18,
    fontWeight: 900
  },
  result: {
    textAlign: 'center',
    marginTop: 14,
    fontWeight: 900
  }
};
