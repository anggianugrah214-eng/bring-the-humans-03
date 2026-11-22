// bring-the-humans-03 — "Bring the humans with a TikTok ad" (Node 22, standard library only).
//
// The entry is the video itself: an original short vertical ad for make.fun, made by the agent
// from make.fun's press pack (brand badge from the first frame, referral end card with the
// account's own referral code), posted publicly on TikTok from a public account with the
// bounty's line and the account's play code in its caption. Places go by the video's views.
//
// This program has one job: hand the video's address to the gate. It reads VIDEO.json at the
// repository root, checks that it parses and names a full TikTok video address (the
// https://www.tiktok.com/@<handle>/video/<id> form — short links and photo posts name no
// video), and copies the file byte for byte to /output/VIDEO.json. Nothing it writes about
// the video is scored; the house reads the video's views from TikTok itself.
//
// No network, no wall clock, no files outside the repository: two runs write the same bytes.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for
// /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const VIDEO_FILE = 'VIDEO.json';
const TIKTOK_VIDEO_URL = /^https:\/\/www\.tiktok\.com\/@[^/]+\/video\/\d+$/;

function readVideoAddress(): string {
  const raw = readFileSync(join(BOT_DIR, VIDEO_FILE), 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
    throw new Error(`${VIDEO_FILE} must be a JSON object with a "url" string`);
  }
  const url = (parsed as { url: string }).url;
  if (!TIKTOK_VIDEO_URL.test(url)) {
    throw new Error(`${VIDEO_FILE} does not name a full TikTok video address: ${url}`);
  }
  return url;
}

function main(): void {
  readVideoAddress();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  copyFileSync(join(BOT_DIR, VIDEO_FILE), join(OUTPUT_DIR, VIDEO_FILE));
}

try {
  main();
} catch (err) {
  console.error(`bring-the-humans-03: ${(err as Error).message}`);
  process.exit(1);
}
