import DiceCanvas from '../../../components/DiceCanvas';
import {
  money,
  generateNonce,
  generateRandomFloat,
  generateServerSeed,
  generateServerSeedHash
} from '../gameEngine';

export function playDice({ betAmount, clientSeed, target = 50.5, condition = 'over' }) {
  const nonce = generateNonce();
  const serverSeed = generateServerSeed();
  const serverSeedHash = generateServerSeedHash(serverSeed);

  const random = generateRandomFloat(serverSeed, clientSeed, nonce);
  const roll = money(random * 100);

  const safeTarget = Math.min(98, Math.max(2, Number(target)));
  const mode = condition === 'under' ? 'under' : 'over';

  const winChance = mode === 'over'
    ? money(100 - safeTarget)
    : money(safeTarget);

  const multiplier = money((99 / winChance)); // 99% RTP

  const win = mode === 'over'
    ? roll > safeTarget
    : roll < safeTarget;

  const payout = win ? money(betAmount * multiplier) : 0;
  const profit = money(payout - betAmount);

  return {
    game: 'dice',
    roll,
    target: safeTarget,
    condition: mode,
    winChance,
    multiplier,
    payout,
    profit,
    result: win ? 'win' : 'loss',
    gameData: { roll, target: safeTarget, condition: mode, winChance, random },
    provablyFair: { serverSeed, serverSeedHash, clientSeed, nonce }
  };
}
