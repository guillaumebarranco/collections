const crypto = require('crypto');

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = 'sha512';

function hashPassword(password: string, salt?: string) {
  const passwordSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, passwordSalt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString('hex');
  return { hash, salt: passwordSalt };
}

function verifyPassword(password: string, hash: string, salt: string) {
  if (!hash || !salt) return false;
  const computed = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
    .toString('hex');
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(computed, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

module.exports = {
  hashPassword,
  verifyPassword,
};

export {};
