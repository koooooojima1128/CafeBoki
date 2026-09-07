import { Platform, Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

export type ShareOutcome = 'shared' | 'copied' | 'saved' | 'cancelled' | 'unsupported';

function legacyCopy(text: string): boolean {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Share plain text + a link (system sheet on native, Web Share / clipboard on web). */
export async function shareText(text: string, url: string): Promise<ShareOutcome> {
  const body = `${text}\n${url}`;

  if (Platform.OS === 'web') {
    const nav: any = typeof navigator !== 'undefined' ? navigator : null;
    if (nav?.share) {
      try {
        await nav.share({ text, url });
        return 'shared';
      } catch (e: any) {
        if (e?.name === 'AbortError') return 'cancelled';
        // fall through to clipboard
      }
    }
    if (nav?.clipboard?.writeText) {
      try {
        await nav.clipboard.writeText(body);
        return 'copied';
      } catch {
        // fall through to legacy copy
      }
    }
    return legacyCopy(body) ? 'copied' : 'unsupported';
  }

  try {
    await Share.share({ message: body });
    return 'shared';
  } catch {
    return 'cancelled';
  }
}

/**
 * Turn a view into a PNG and let the user keep it.
 * native: capture → system share sheet (save to Photos / send to LINE…).
 * web:    capture → trigger a file download.
 */
export async function shareImage(
  ref: Parameters<typeof captureRef>[0],
  filename = 'boki-cert.png',
): Promise<ShareOutcome> {
  try {
    if (Platform.OS === 'web') {
      const uri = await captureRef(ref, {
        format: 'png',
        quality: 1,
        result: 'data-uri',
      });
      const a = document.createElement('a');
      a.href = uri;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return 'saved';
    }

    const uri = await captureRef(ref, { format: 'png', quality: 1 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'image/png',
        dialogTitle: '修了証をシェア',
      });
      return 'shared';
    }
    return 'unsupported';
  } catch {
    return 'unsupported';
  }
}
