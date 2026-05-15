import {
  money,
  generateNonce,
  generateRandomFloat,
  generateServerSeed,
  generateServerSeedHash
} from '../gameEngine';

export function playDice({
  betAmount,
  clientSeed
}) {
  const nonce = generateNonce();

  const serverSeed = generateServerSeed();
  const serverSeedHash = generateServerSeedHash(serverSeed);

  const random = generateRandomFloat(
    serverSeed,
    clientSeed,
    nonce
  );

  const roll = Math.floor(random * 100) + 1;

  const target = 50;
  const multiplier = 1.98;

  const win = roll > target;

  const payout = win
    ? money(betAmount * multiplier)
    : 0;

  const profit = money(payout - betAmount);

  return {
    game: 'dice',

    roll,
    target,
    result: win ? 'win' : 'loss',

    multiplier,
    payout,
    profit,

    gameData: {
      roll,
      target,
      random
    },

    provablyFair: {
      serverSeed,
      serverSeedHash,
      clientSeed,
      nonce
    }
  };
}
