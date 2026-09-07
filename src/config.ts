/**
 * App-wide constants. Replace the placeholders before launch.
 */

/**
 * Affiliate destination for the スタディング CTA.
 * Replace with the real affiliate/tracking URL. `studyingUrl()` appends a
 * `placement` marker so inflow can be told apart in the affiliate dashboard.
 */
export const STUDYING_URL = 'https://studying.jp/boki/';

export function studyingUrl(placement: string): string {
  const sep = STUDYING_URL.includes('?') ? '&' : '?';
  return `${STUDYING_URL}${sep}ref=bokiapp&placement=${encodeURIComponent(placement)}`;
}

/**
 * Public base URL of the deployed web app. Used to build shareable 修了証 links
 * (`<APP_URL>/cert?d=...`) when sharing from the native app. On web the live
 * origin is used instead, so this only matters for iOS/Android shares.
 */
export const APP_URL = 'https://example.com/boki';
