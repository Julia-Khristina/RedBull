import { Request, Response } from "express";

const selectedCompetitionCookie = "rb24_competition_id";
const maxAgeMs = 1000 * 60 * 60 * 24 * 365;

function parsePositiveInteger(value: unknown): number | null {
  const parsed = typeof value === "string" ? Number(value) : value;

  if (!Number.isInteger(parsed) || Number(parsed) <= 0) {
    return null;
  }

  return Number(parsed);
}

function parseCookieHeader(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce<Record<string, string>>((cookies, item) => {
    const [rawName, ...rawValue] = item.trim().split("=");
    if (!rawName || rawValue.length === 0) return cookies;

    cookies[rawName] = decodeURIComponent(rawValue.join("="));
    return cookies;
  }, {});
}

export function getSelectedCompetitionId(req: Request): number | null {
  const cookies = parseCookieHeader(req.headers.cookie);
  return parsePositiveInteger(cookies[selectedCompetitionCookie]);
}

export function resolveSelectedCompetitionId(req: Request): number | null {
  const explicitId = parsePositiveInteger(req.params.id ?? req.query.competitionId);
  return explicitId ?? getSelectedCompetitionId(req);
}

export function saveSelectedCompetitionId(res: Response, competitionId: number): void {
  res.cookie(selectedCompetitionCookie, String(competitionId), {
    maxAge: maxAgeMs,
    sameSite: "lax",
    path: "/",
  });
}
