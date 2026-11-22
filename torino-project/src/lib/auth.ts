export const ACCESS_COOKIE = 'accessToken';
export const REFRESH_COOKIE = 'refreshToken';
export const AUTH_EVENT = 'torino-auth-change';

const ACCESS_MAX_AGE = 60 * 60; // 1 hour (same as the API token)
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function notify() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getAccessToken() {
  return getCookie(ACCESS_COOKIE);
}

export function getRefreshToken() {
  return getCookie(REFRESH_COOKIE);
}

export function hasSession() {
  return Boolean(getAccessToken() || getRefreshToken());
}

export function saveTokens(accessToken: string, refreshToken: string) {
  setCookie(ACCESS_COOKIE, accessToken, ACCESS_MAX_AGE);
  setCookie(REFRESH_COOKIE, refreshToken, REFRESH_MAX_AGE);
  notify();
}

export function saveAccessToken(accessToken: string) {
  setCookie(ACCESS_COOKIE, accessToken, ACCESS_MAX_AGE);
}

export function clearTokens() {
  removeCookie(ACCESS_COOKIE);
  removeCookie(REFRESH_COOKIE);
  notify();
}
