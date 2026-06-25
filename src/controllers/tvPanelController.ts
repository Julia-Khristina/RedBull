import { Request, Response } from "express";
import { tvPanelService } from "../services/tvPanelService";
import { ValidationError } from "../errors/AppError";

const TV_PANEL_DEFAULT_TOP_N = 3;
const TV_PANEL_MIN_TOP_N = 1;
const TV_PANEL_MAX_TOP_N = 10;

function parseIntegerParam(value: unknown, name: string): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ValidationError(`${name} deve ser um numero inteiro positivo`);
  }

  return parsed;
}

function parseTopN(value: unknown): number {
  if (value === undefined || value === null || value === "") {
    return TV_PANEL_DEFAULT_TOP_N;
  }

  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (
    !Number.isInteger(parsed) ||
    parsed < TV_PANEL_MIN_TOP_N ||
    parsed > TV_PANEL_MAX_TOP_N
  ) {
    throw new ValidationError(
      `topN deve ser um numero inteiro entre ${TV_PANEL_MIN_TOP_N} e ${TV_PANEL_MAX_TOP_N}`
    );
  }

  return parsed;
}

export const tvPanelController = {
  async metrics(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.id, "id");
    const topN = parseTopN(req.query.topN);

    const payload = await tvPanelService.generateMetrics(competitionId, topN);

    res.status(200).json(payload);
  },

  // Rota SSR pública — alimenta o Painel TV (US19 #519). O polling subsequente
  // do client consome `metrics` (acima) para atualizar in-place a cada 10s.
  async renderTvPanel(req: Request, res: Response): Promise<void> {
    const competitionId = parseIntegerParam(req.params.id, "id");

    const payload = await tvPanelService.generateMetrics(
      competitionId,
      TV_PANEL_DEFAULT_TOP_N
    );

    res.render("tv-panel/tvPanel", {
      title: `${payload.competition_name} — Painel TV`,
      payload,
      layout: "layouts/tv",
    });
  },
};
