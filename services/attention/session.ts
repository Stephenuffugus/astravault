import * as Crypto from 'expo-crypto';

let cachedSessionId: string | null = null;

export const getSessionId = (): string => {
  if (cachedSessionId !== null) return cachedSessionId;
  cachedSessionId = `s_${Date.now().toString(36)}_${randomSuffix(12)}`;
  return cachedSessionId;
};

export const generateNonce = (): string => {
  const bytes = Crypto.getRandomBytes(16);
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i] ?? 0;
    out += b.toString(16).padStart(2, '0');
  }
  return out;
};

const randomSuffix = (len: number): string => {
  const bytes = Crypto.getRandomBytes(Math.ceil(len / 2));
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i] ?? 0;
    out += b.toString(16).padStart(2, '0');
  }
  return out.slice(0, len);
};

/** Test/dev only — resets the cached session ID. Not for production code paths. */
export const _resetSessionForTest = (): void => {
  cachedSessionId = null;
};
