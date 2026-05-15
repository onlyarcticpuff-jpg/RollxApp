
import crypto from 'crypto';

export function money(value) {
  return Number(Number(value).toFixed(2));
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

export function generateServerSeed() {
  return crypto.randomBytes(32).toString('hex');
}

export function generateServerSeedHash(serverSeed) {
  return sha256(serverSeed);
}

export function generateRandomFloat(serverSeed, clientSeed, nonce) {
  const hmac = crypto
    .createHmac('sha256', serverSeed)
    .update(`${clientSeed}:${nonce}`)
    .digest('hex');

  const int = parseInt(hmac.slice(0, 8), 16);

  return int / 0xffffffff;
}

export function generateNonce() {
  return Date.now();
}
