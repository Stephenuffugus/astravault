/**
 * Astrometry.net Nova endpoint wrapper — v0.2 server-side plate-solve path.
 *
 * Astrometry.net (nova.astrometry.net) is the gold-standard open-source
 * astrometric calibration service since 2008. It accepts an uploaded image
 * and returns RA/Dec center, scale, orientation, and a list of matched
 * stars. Free tier, requires API key (free signup).
 *
 * STATUS: STUB. The metadata-based plate-solve at
 * services/meteor/plateSolve.ts is the v0.1 path and is wired into the
 * capture engine. This file defines the wire-format we'll use when we
 * upgrade — putting the surface in place so the upgrade is a swap, not a
 * rewrite.
 *
 * Latency: 30s-5min per solve (Nova queues submissions). Best used for
 * async post-capture enrichment, not for in-loop ATP gating.
 */

import type { PlateSolveResult } from '@/services/meteor/plateSolve';

const NOVA_BASE = 'https://nova.astrometry.net/api';

export interface AstrometrySubmission {
  /** Astrometry.net job ID. Poll for completion. */
  jobId: string;
  /** Astrometry.net submission ID — used in the job-status URL. */
  submissionId: string;
  /** When we submitted, UTC ms. */
  submittedAt: number;
}

/** Auth response shape from Nova `login` endpoint. */
interface NovaLoginResponse {
  status: string;
  session?: string;
}

/**
 * Authenticate with Nova and return a session token. The session lasts
 * for a few hours; cache and reuse.
 */
export const novaLogin = async (apiKey: string): Promise<string> => {
  const body = `request-json=${encodeURIComponent(JSON.stringify({ apikey: apiKey }))}`;
  const res = await fetch(`${NOVA_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Nova login failed: ${res.status}`);
  const data = (await res.json()) as NovaLoginResponse;
  if (data.status !== 'success' || !data.session) {
    throw new Error('Nova login: no session returned');
  }
  return data.session;
};

/**
 * Submit an image URL for plate-solving. The image must be publicly fetchable
 * by Nova — we don't yet have CDN-hosted captures, so this path is gated on
 * a future Firebase Storage upload pipeline.
 */
export const submitForSolve = async (params: {
  session: string;
  imageUrl: string;
  estimatedRa?: number;
  estimatedDec?: number;
  estimatedRadiusDeg?: number;
}): Promise<AstrometrySubmission> => {
  const payload: Record<string, unknown> = {
    session: params.session,
    url: params.imageUrl,
    allow_commercial_use: 'd',
    allow_modifications: 'd',
    publicly_visible: 'n',
  };
  if (params.estimatedRa != null && params.estimatedDec != null) {
    payload.center_ra = params.estimatedRa;
    payload.center_dec = params.estimatedDec;
    payload.radius = params.estimatedRadiusDeg ?? 10;
  }

  const body = `request-json=${encodeURIComponent(JSON.stringify(payload))}`;
  const res = await fetch(`${NOVA_BASE}/url_upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) throw new Error(`Nova submission failed: ${res.status}`);
  const data = (await res.json()) as { status: string; subid: number; hash: string };
  return {
    jobId: String(data.subid),
    submissionId: data.hash,
    submittedAt: Date.now(),
  };
};

/**
 * Poll a Nova submission for completion. Returns a PlateSolveResult shape
 * when finished, null while still queued / solving.
 */
export const pollSolve = async (
  submissionId: string,
): Promise<PlateSolveResult | null> => {
  const res = await fetch(`${NOVA_BASE}/submissions/${submissionId}`);
  if (!res.ok) return null;
  const data = (await res.json()) as {
    jobs?: number[];
    job_calibrations?: number[][];
  };
  const jobs = data.jobs ?? [];
  if (jobs.length === 0) return null;
  const jobId = jobs[0];
  if (jobId == null) return null;

  const jobRes = await fetch(`${NOVA_BASE}/jobs/${jobId}/calibration/`);
  if (!jobRes.ok) return null;
  const cal = (await jobRes.json()) as {
    ra?: number;
    dec?: number;
    orientation?: number;
    pixscale?: number;
    radius?: number;
  };
  if (cal.ra == null || cal.dec == null) return null;

  return {
    raDegrees: cal.ra,
    decDegrees: cal.dec,
    rotationDegrees: cal.orientation ?? 0,
    pixelScale: cal.pixscale ?? 0,
    uncertaintyArcsec: cal.radius != null ? cal.radius * 3600 : 0,
    confidence: 0.95,
    source: 'astrometry_net',
  };
};
