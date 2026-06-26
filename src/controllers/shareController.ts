import { Request, Response } from "express";
import { shareService } from "../services/shareService";
import { teamService } from "../services/teamService";
import { AppError } from "../errors/AppError";

function parseCompetitionId(req: Request): number {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    throw new AppError("ID da competição inválido", 400);
  }
  return id;
}

export const shareController = {
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
          // No runnerId provided – pick the first athlete of the team
          const teamUuid = (req.params as any).teamUuid;
          if (!teamUuid) {
            throw new AppError("UUID da equipe não informado", 400);
          }
          const team = await teamService.findByUuid(teamUuid);
          if (!team) {
            throw new AppError("Equipe não encontrada", 404);
          }
          const athletes = await shareService.getAthletes(team.id);
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
        teamUuid: (req.params as any).teamUuid,
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

