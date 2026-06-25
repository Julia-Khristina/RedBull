import { Request, Response } from "express";
import { shareService } from "../services/shareService";
import { competitionService } from "../services/competitionService";
import { AppError } from "../errors/AppError";
import { Competition } from "../models/competition";

function parseCompetitionId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    throw new AppError("ID da competição inválido", 400);
  }
  return id;
}

async function resolveCompetition(competitionId: number): Promise<Competition> {
  const comp = await competitionService.findById(competitionId);
  if (!comp) {
    throw new AppError("Competição não encontrada", 404);
  }
  return comp;
}

export const shareController = {
  async renderSharePage(req: Request, res: Response): Promise<void> {
    try {
      const competitionId = parseCompetitionId(req);
      const competition = await resolveCompetition(competitionId);

      const [athletes, highlights] = await Promise.all([
        shareService.getAthletes(competitionId),
        shareService.getHighlights(competitionId),
      ]);

      res.render("share/share", {
        title: "Compartilhar Resultados",
        currentPage: "share",
        pageCSS: "share",
        competition,
        competitionId,
        competitionName: competition.name,
        athletes,
        highlights,
        layout: "layouts/main",
      });
    } catch (err) {
      if (err instanceof AppError) {
        res.status(err.statusCode).render("errors/404", {
          title: err.message,
          message: err.message,
        });
        return;
      }
      res.status(500).render("errors/500", {
        title: "Erro interno",
        message: "Erro ao carregar página de compartilhar",
      });
    }
  },

  async renderTemplate(req: Request, res: Response): Promise<void> {
    try {
      const competitionId = parseCompetitionId(req);
      const type = req.params.type as string;
      const runnerId = req.query.runnerId ? Number(req.query.runnerId) : null;

      const validTypes = ["athlete", "maior-km", "menor-pace", "manha", "tarde", "madrugada"];
      if (!validTypes.includes(type)) {
        throw new AppError("Tipo de template inválido", 400);
      }

      let highlight;
      if (type === "athlete" && runnerId) {
        highlight = await shareService.getAthleteHighlight(competitionId, runnerId);
      } else if (type === "athlete") {
        const athletes = await shareService.getAthletes(competitionId);
        if (athletes.length === 0) {
          throw new AppError("Nenhum atleta encontrado", 400);
        }
        highlight = await shareService.getAthleteHighlight(competitionId, athletes[0].id);
      } else {
        const highlights = await shareService.getHighlights(competitionId);
        const found = highlights.find((h) => h.type === type);
        if (!found) {
          throw new AppError("Destaque não encontrado", 404);
        }
        highlight = found;
      }

      const competitionName = await shareService.getCompetitionName(competitionId);

      res.render("share/template", {
        title: "Compartilhar - " + highlight.title,
        highlight,
        competitionName,
        competitionId,
        layout: "layouts/share",
      });
    } catch (err) {
      if (err instanceof AppError) {
        res.status(err.statusCode).render("errors/404", {
          title: err.message,
          message: err.message,
        });
        return;
      }
      console.error("Erro ao renderizar template:", err);
      res.status(500).render("errors/500", {
        title: "Erro interno",
        message: "Erro ao gerar template de compartilhamento",
      });
    }
  },
};
