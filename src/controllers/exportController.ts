import { Request, Response } from "express";
import { exportService } from "../services/exportService";
import { generateExcel, SHEET_IDS, SheetId } from "../services/excelExportService";

export const exportController = {
  async exportCompetition(req: Request, res: Response): Promise<void> {
    const data = await exportService.exportCompetition(req.params.id);
    res.status(200).json(data);
  },

  async exportCompetitionExcel(req: Request, res: Response): Promise<void> {
    const data = await exportService.exportCompetition(req.params.id);

    const body = req.body ?? {};
    const requestedSheets: string[] = Array.isArray(body.sheets)
      ? body.sheets
      : Object.values(SHEET_IDS);

    const validSheetIds = new Set<string>(Object.values(SHEET_IDS));
    const selectedSheets: SheetId[] = requestedSheets.filter(
      (s): s is SheetId => validSheetIds.has(s)
    );

    if (selectedSheets.length === 0) {
      res.status(400).json({ message: "Nenhuma aba válida selecionada." });
      return;
    }

    const buffer = await generateExcel(data, selectedSheets);

    const safeName = data.competition.name
      .replace(/[/\\?*\[\]:]/g, "_")
      .slice(0, 50);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}.xlsx"`
    );

    res.status(200).send(Buffer.from(buffer));
  },
};
