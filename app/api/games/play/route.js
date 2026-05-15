import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

import { money } from '@/lib/gameEngine';
import { playDice } from '@/lib/games/dice';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  try {
    const body = await req.json();

    const telegramId = body.telegram_id;
    const gameId = body.game_id;
    const betAmount = money(body.bet_amount);

    const clientSeed =
      body.client_seed ||
      `rollx-${telegramId}`;

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Missing telegram_id' },
        { status: 400 }
      );
    }

    if (!betAmount || betAmount <= 0) {
      return NextResponse.json(
        { error: 'Invalid bet amount' },
        { status: 400 }
      );
    }

    const { data: user, error: userError } =
      await supabase
        .from('users')
        .select('*')
        .eq('telegram_id', telegramId)
        .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const balanceBefore = money(user.balance);

    if (balanceBefore < betAmount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    let gameResult;

    switch (gameId) {
      case 'dice':
        gameResult = playDice({
          betAmount,
          clientSeed
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid game' },
          { status: 400 }
        );
    }

    const balanceAfter = money(
      balanceBefore -
      betAmount +
      gameResult.payout
    );

    const { data: bet, error: betError } =
      await supabase
        .from('bets')
        .insert({
          user_id: user.id,
          game_id: gameId,

          idempotency_key: crypto.randomUUID(),

          status: 'resolved',

          bet_amount: betAmount,

          multiplier: gameResult.multiplier,
          payout: gameResult.payout,
          profit: gameResult.profit,

          result: gameResult.result,

          game_data: gameResult.gameData,

          server_seed_hash:
            gameResult.provablyFair.serverSeedHash,

          server_seed:
            gameResult.provablyFair.serverSeed,

          client_seed:
            gameResult.provablyFair.clientSeed,

          nonce:
            gameResult.provablyFair.nonce,

          resolved_at: new Date().toISOString()
        })
        .select()
        .single();

    if (betError) {
      console.error('BET INSERT ERROR:', betError);

      return NextResponse.json(
        {
          error: 'Bet insert failed',
          details: betError.message
        },
        { status: 500 }
      );
    }

    await supabase
      .from('users')
      .update({
        balance: balanceAfter,

        total_wagered:
          money(
            Number(user.total_wagered || 0) +
            betAmount
          ),

        total_won:
          money(
            Number(user.total_won || 0) +
            gameResult.payout
          ),

        total_profit:
          money(
            Number(user.total_profit || 0) +
            gameResult.profit
          ),

        xp:
          Number(user.xp || 0) +
          Math.floor(betAmount),

        updated_at:
          new Date().toISOString()
      })
      .eq('id', user.id);

    await supabase
      .from('transactions')
      .insert([
        {
          user_id: user.id,

          idempotency_key:
            crypto.randomUUID(),

          type: 'bet',

          amount: -betAmount,

          balance_before:
            balanceBefore,

          balance_after:
            money(balanceBefore - betAmount),

          reference_type: 'bet',
          reference_id: bet.id,

          metadata: {
            game_id: gameId
          }
        },

        {
          user_id: user.id,

          idempotency_key:
            crypto.randomUUID(),

          type:
            gameResult.result === 'win'
              ? 'win'
              : 'push',

          amount:
            gameResult.payout,

          balance_before:
            money(balanceBefore - betAmount),

          balance_after:
            balanceAfter,

          reference_type: 'bet',
          reference_id: bet.id,

          metadata: {
            game_id: gameId,
            roll: gameResult.roll
          }
        }
      ]);

    return NextResponse.json({
      success: true,

      game_id: gameId,

      bet_id: bet.id,

      result: gameResult.result,

      roll: gameResult.roll,
      target: gameResult.target,

      multiplier:
        gameResult.multiplier,

      bet_amount: betAmount,

      payout:
        gameResult.payout,

      profit:
        gameResult.profit,

      balance:
        balanceAfter,

      provably_fair:
        gameResult.provablyFair
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
