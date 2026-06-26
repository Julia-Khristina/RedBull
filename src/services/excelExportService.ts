import ExcelJS from "exceljs";
import { CompetitionExport } from "../models/export";
import { Checkpoint } from "../models/checkpoint";
import { inferInputMethod, inferInputMethodLabel } from "../helpers/inferInputMethod";

const SHEET_IDS = {
  DASHBOARD: "dashboard",
  EQUIPES: "equipes",
  ATLETAS: "atletas",
  OPERACAO: "operacao",
  AUDITORIA: "auditoria",
} as const;

export type SheetId = (typeof SHEET_IDS)[keyof typeof SHEET_IDS];

export const SHEET_DEFINITIONS: {
  id: SheetId;
  label: string;
  description: string;
}[] = [
  {
    id: SHEET_IDS.DASHBOARD,
    label: "Dashboard Executivo",
    description: "KPIs gerais, ranking resumido, anomalias, uso de OCR e distribuição por operador",
  },
  {
    id: SHEET_IDS.EQUIPES,
    label: "Equipes",
    description: "Ranking detalhado das equipes com km total, pace médio e trocas",
  },
  {
    id: SHEET_IDS.ATLETAS,
    label: "Atletas",
    description: "Performance individual de cada atleta (km, pace médio, checkpoints)",
  },
  {
    id: SHEET_IDS.OPERACAO,
    label: "Operação",
    description: "Checkpoints por operador, método de entrada (manual vs OCR) e tempo médio",
  },
  {
    id: SHEET_IDS.AUDITORIA,
    label: "Auditoria",
    description: "Todos os checkpoints em ordem cronológica e registros suspeitos",
  },
];

const HEADER_STYLE: Partial<ExcelJS.Style> = {
  font: { bold: true, color: { argb: "FF0F0069" }, size: 11 },
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8E0FF" } },
  border: {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  },
};

const CELL_STYLE: Partial<ExcelJS.Style> = {
  border: {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  },
};

const TITLE_STYLE: Partial<ExcelJS.Style> = {
  font: { bold: true, size: 14, color: { argb: "FF0F0069" } },
};

const SECTION_STYLE: Partial<ExcelJS.Style> = {
  font: { bold: true, size: 12, color: { argb: "FF0F0069" } },
  fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFF0ECFF" } },
};

const EMPTY_STYLE: Partial<ExcelJS.Style> = {
  font: { italic: true, color: { argb: "FF888888" }, size: 11 },
};

function applyHeaderRow(ws: ExcelJS.Worksheet, row: number, values: string[]) {
  const r = ws.getRow(row);
  values.forEach((v, i) => {
    const cell = r.getCell(i + 1);
    cell.value = v;
    cell.style = HEADER_STYLE;
  });
  r.commit();
}

function applyCellStyle(
  ws: ExcelJS.Worksheet,
  row: number,
  col: number,
  value: unknown,
  extraStyle?: Partial<ExcelJS.Style>
) {
  const cell = ws.getCell(row, col);
  cell.value = value as string | number;
  cell.style = { ...CELL_STYLE, ...extraStyle };
}

function formatPace(seconds: number | null): string {
  if (seconds === null || !Number.isFinite(seconds)) return "-";
  const rounded = Math.round(seconds);
  const m = Math.floor(rounded / 60);
  const s = rounded % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function parseTimeToSeconds(value: string | null): number | null {
  if (!value) return null;
  const parts = value.trim().split(":").map(Number);
  if (parts.some((p) => !Number.isFinite(p) || p < 0)) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

function getCheckpointPaceSeconds(cp: Checkpoint): number | null {
  const timeSeconds = parseTimeToSeconds(cp.time);
  if (timeSeconds !== null && cp.distance_km > 0) {
    return timeSeconds / cp.distance_km;
  }
  const pace = cp.pace ? cp.pace.replace("/km", "") : null;
  return parseTimeToSeconds(pace);
}

function countTeamTurns(checkpoints: Checkpoint[], teamId: number): number {
  const teamCps = checkpoints
    .filter((cp) => cp.runner?.id_team === teamId)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  let turns = 0;
  let lastRunnerId: number | null = null;
  for (const cp of teamCps) {
    if (cp.id_runner !== lastRunnerId) {
      if (lastRunnerId !== null) turns++;
      lastRunnerId = cp.id_runner;
    }
  }
  return turns;
}

function computeOperatorMetrics(data: CompetitionExport) {
  const opMap = new Map<
    number,
    {
      name: string;
      total: number;
      manual: number;
      ocr: number;
      gaps: number[];
    }
  >();

  const sorted = [...data.checkpoints].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const lastTimeByOp = new Map<number, number>();

  for (const cp of sorted) {
    const adminId = cp.id_admin;
    const existing = opMap.get(adminId) ?? {
      name: cp.admin?.name ?? `#${adminId}`,
      total: 0,
      manual: 0,
      ocr: 0,
      gaps: [],
    };
    existing.total++;

    const method = inferInputMethod(cp.identifier, cp.image as Record<string, unknown> | null);
    if (method === "ocr") {
      existing.ocr++;
    } else {
      existing.manual++;
    }

    const t = new Date(cp.created_at).getTime();
    const prev = lastTimeByOp.get(adminId);
    if (prev !== undefined) {
      const gap = t - prev;
      if (gap > 0 && gap < 300000) {
        existing.gaps.push(gap);
      }
    }
    lastTimeByOp.set(adminId, t);

    opMap.set(adminId, existing);
  }

  return Array.from(opMap.entries())
    .map(([id, v]) => {
      const avgGap =
        v.gaps.length > 0
          ? v.gaps.reduce((a, b) => a + b, 0) / v.gaps.length / 1000
          : 0;
      return {
        id,
        name: v.name,
        total: v.total,
        manual: v.manual,
        ocr: v.ocr,
        pctOcr: v.total > 0 ? Math.round((v.ocr / v.total) * 100) : 0,
        avgTimeSec: Math.round(avgGap),
      };
    })
    .sort((a, b) => b.total - a.total);
}

function writeEmptyMessage(ws: ExcelJS.Worksheet, row: number, message: string) {
  ws.getCell(row, 1).value = message;
  ws.getCell(row, 1).style = EMPTY_STYLE;
}

function buildSheetDashboard(
  wb: ExcelJS.Workbook,
  data: CompetitionExport
): void {
  const ws = wb.addWorksheet("Dashboard Executivo");

  ws.getCell("A1").value = "Dashboard Executivo";
  ws.getCell("A1").style = TITLE_STYLE;

  ws.getCell("A3").value = "Informações Gerais";
  ws.getCell("A3").style = SECTION_STYLE;

  const info: [string, string][] = [
    ["Competição", data.competition.name],
    ["Data", data.competition.date],
    ["Status", data.competition.status],
    ["Equipes", String(data.teams.length)],
    ["Atletas", String(data.runners.length)],
    ["Checkpoints", String(data.checkpoints.length)],
    [
      "KM Total",
      data.rankings.teams.length > 0
        ? `${data.rankings.teams.reduce((s, t) => s + t.total_distance_km, 0).toFixed(1)} km`
        : "-",
    ],
    [
      "Pace Médio Geral",
      (() => {
        const paces = data.rankings.runners
          .map((r) => r.average_pace_seconds)
          .filter((p): p is number => p !== null);
        if (paces.length === 0) return "-";
        const avg = paces.reduce((a, b) => a + b, 0) / paces.length;
        return formatPace(Math.round(avg));
      })(),
    ],
  ];

  info.forEach(([label, value], i) => {
    const r = 4 + i;
    applyCellStyle(ws, r, 1, label, {
      font: { bold: true, color: { argb: "FF0F0069" } },
    });
    applyCellStyle(ws, r, 2, value);
  });

  ws.getColumn(1).width = 28;
  ws.getColumn(2).width = 40;

  const ops = computeOperatorMetrics(data);
  const ocrTotal = ops.reduce((s, o) => s + o.ocr, 0);
  const cpTotal = ops.reduce((s, o) => s + o.total, 0);
  const pctOcr = cpTotal > 0 ? Math.round((ocrTotal / cpTotal) * 100) : 0;
  ws.getCell(4 + info.length + 1, 1).value = "Uso de OCR";
  ws.getCell(4 + info.length + 1, 1).style = { font: { bold: true, color: { argb: "FF0F0069" } } };
  ws.getCell(4 + info.length + 1, 2).value = `${pctOcr}%`;

  const rankStart = 4 + info.length + 3;
  ws.getCell(rankStart, 1).value = "Classificação";
  ws.getCell(rankStart, 1).style = SECTION_STYLE;

  const sortedTeams = [...data.rankings.teams].sort(
    (a, b) => a.position - b.position
  );

  if (sortedTeams.length === 0) {
    writeEmptyMessage(ws, rankStart + 1, "Nenhum dado de classificação disponível.");
  } else {
    applyHeaderRow(ws, rankStart + 1, ["#", "Equipe", "KM Total", "Pace Médio"]);
    sortedTeams.forEach((team, i) => {
      const r = rankStart + 2 + i;
      applyCellStyle(ws, r, 1, team.position);
      applyCellStyle(ws, r, 2, team.team_name, {
        font: { bold: true },
      });
      applyCellStyle(ws, r, 3, `${team.total_distance_km.toFixed(1)} km`);
      applyCellStyle(ws, r, 4, team.average_pace ?? "-");
    });

    const opStart = rankStart + 2 + sortedTeams.length + 1;
    ws.getCell(opStart, 1).value = "Checkpoints por Operador";
    ws.getCell(opStart, 1).style = SECTION_STYLE;

    if (ops.length === 0) {
      writeEmptyMessage(ws, opStart + 1, "Nenhum checkpoint registrado.");
    } else {
      applyHeaderRow(ws, opStart + 1, ["Operador", "Checkpoints"]);
      ops.forEach((op, i) => {
        const r = opStart + 2 + i;
        applyCellStyle(ws, r, 1, op.name);
        applyCellStyle(ws, r, 2, op.total);
      });
    }
  }
}

function buildSheetEquipes(
  wb: ExcelJS.Workbook,
  data: CompetitionExport
): void {
  const ws = wb.addWorksheet("Equipes");

  ws.getCell("A1").value = "Ranking de Equipes";
  ws.getCell("A1").style = TITLE_STYLE;

  applyHeaderRow(ws, 3, [
    "#",
    "Equipe",
    "Atletas",
    "KM Total",
    "Pace Médio",
    "Diferença (km)",
    "Trocas",
  ]);

  ws.getColumn(1).width = 6;
  ws.getColumn(2).width = 35;
  ws.getColumn(3).width = 10;
  ws.getColumn(4).width = 14;
  ws.getColumn(5).width = 14;
  ws.getColumn(6).width = 16;
  ws.getColumn(7).width = 10;

  const sorted = [...data.rankings.teams].sort(
    (a, b) => a.position - b.position
  );

  if (sorted.length === 0) {
    writeEmptyMessage(ws, 5, "Nenhum dado de classificação disponível.");
    return;
  }

  const leaderKm = sorted[0].total_distance_km;

  sorted.forEach((team, i) => {
    const r = 4 + i;
    const diff =
      i === 0
        ? "—"
        : `${(team.total_distance_km - leaderKm).toFixed(1)} km`;
    const turns = countTeamTurns(data.checkpoints, team.id_team);

    applyCellStyle(ws, r, 1, team.position);
    applyCellStyle(ws, r, 2, team.team_name, {
      font: { bold: true },
    });
    applyCellStyle(ws, r, 3, team.runner_count);
    applyCellStyle(ws, r, 4, `${team.total_distance_km.toFixed(1)} km`);
    applyCellStyle(ws, r, 5, team.average_pace ? `${team.average_pace}/km` : "-");
    applyCellStyle(ws, r, 6, diff);
    applyCellStyle(ws, r, 7, turns);
  });
}

function buildSheetAtletas(
  wb: ExcelJS.Workbook,
  data: CompetitionExport
): void {
  const ws = wb.addWorksheet("Atletas");

  ws.getCell("A1").value = "Performance dos Atletas";
  ws.getCell("A1").style = TITLE_STYLE;

  applyHeaderRow(ws, 3, [
    "#",
    "Atleta",
    "Equipe",
    "KM Total",
    "KM Médio",
    "Pace Médio",
    "Checkpoints",
  ]);

  ws.getColumn(1).width = 6;
  ws.getColumn(2).width = 30;
  ws.getColumn(3).width = 30;
  ws.getColumn(4).width = 12;
  ws.getColumn(5).width = 12;
  ws.getColumn(6).width = 14;
  ws.getColumn(7).width = 12;

  const cpCountByRunner = new Map<number, number>();
  for (const cp of data.checkpoints) {
    cpCountByRunner.set(
      cp.id_runner,
      (cpCountByRunner.get(cp.id_runner) ?? 0) + 1
    );
  }

  const sorted = [...data.rankings.runners].sort(
    (a, b) => a.position - b.position
  );

  if (sorted.length === 0) {
    writeEmptyMessage(ws, 5, "Nenhum dado de atleta disponível.");
    return;
  }

  sorted.forEach((runner, i) => {
    const r = 4 + i;
    const cpCount = cpCountByRunner.get(runner.id_runner) ?? 0;
    const avgKm =
      cpCount > 0
        ? (runner.total_distance_km / cpCount).toFixed(2)
        : "-";
    applyCellStyle(ws, r, 1, runner.position);
    applyCellStyle(ws, r, 2, runner.runner_name ?? "-");
    applyCellStyle(ws, r, 3, runner.team_name ?? "-");
    applyCellStyle(ws, r, 4, `${runner.total_distance_km.toFixed(1)}`);
    applyCellStyle(ws, r, 5, `${avgKm}`);
    applyCellStyle(ws, r, 6, runner.average_pace ?? "-");
    applyCellStyle(ws, r, 7, cpCount);
  });
}

function buildSheetOperacao(
  wb: ExcelJS.Workbook,
  data: CompetitionExport
): void {
  const ws = wb.addWorksheet("Operação");

  ws.getCell("A1").value = "Operação";
  ws.getCell("A1").style = TITLE_STYLE;

  applyHeaderRow(ws, 3, [
    "Operador",
    "Checkpoints",
    "Manuais",
    "OCR",
    "% OCR",
    "Tempo Médio/CP",
  ]);

  ws.getColumn(1).width = 25;
  ws.getColumn(2).width = 14;
  ws.getColumn(3).width = 12;
  ws.getColumn(4).width = 10;
  ws.getColumn(5).width = 10;
  ws.getColumn(6).width = 18;

  const ops = computeOperatorMetrics(data);

  if (ops.length === 0) {
    writeEmptyMessage(ws, 5, "Nenhum checkpoint registrado.");
    return;
  }

  ops.forEach((op, i) => {
    const r = 4 + i;
    applyCellStyle(ws, r, 1, op.name);
    applyCellStyle(ws, r, 2, op.total);
    applyCellStyle(ws, r, 3, op.manual);
    applyCellStyle(ws, r, 4, op.ocr);
    applyCellStyle(ws, r, 5, `${op.pctOcr}%`);
    applyCellStyle(ws, r, 6, op.avgTimeSec > 0 ? `${op.avgTimeSec}s` : "-");
  });
}

function buildSheetAuditoria(
  wb: ExcelJS.Workbook,
  data: CompetitionExport
): void {
  const ws = wb.addWorksheet("Auditoria");

  ws.getCell("A1").value = "Todos os Checkpoints";
  ws.getCell("A1").style = TITLE_STYLE;

  applyHeaderRow(ws, 3, [
    "#",
    "Atleta",
    "Equipe",
    "Hora",
    "Pace",
    "KM",
    "Operador",
    "Input",
  ]);

  ws.getColumn(1).width = 6;
  ws.getColumn(2).width = 25;
  ws.getColumn(3).width = 25;
  ws.getColumn(4).width = 10;
  ws.getColumn(5).width = 12;
  ws.getColumn(6).width = 10;
  ws.getColumn(7).width = 20;
  ws.getColumn(8).width = 10;

  const sorted = [...data.checkpoints].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  let currentRow = 4;

  if (sorted.length === 0) {
    writeEmptyMessage(ws, 4, "Nenhum checkpoint registrado.");
    currentRow = 6;
  } else {
    sorted.forEach((cp, i) => {
      const r = 4 + i;
      applyCellStyle(ws, r, 1, i + 1);
      applyCellStyle(ws, r, 2, cp.runner?.name ?? `#${cp.id_runner}`);
      applyCellStyle(ws, r, 3, cp.runner?.team?.name ?? "-");
      applyCellStyle(ws, r, 4, new Date(cp.created_at).toLocaleTimeString("pt-BR"));
      applyCellStyle(ws, r, 5, cp.pace ?? "-");
      applyCellStyle(ws, r, 6, cp.distance_km ? cp.distance_km.toFixed(2) : "-");
      applyCellStyle(ws, r, 7, cp.admin?.name ?? `#${cp.id_admin}`);
      applyCellStyle(ws, r, 8, inferInputMethodLabel(cp.identifier, cp.image as Record<string, unknown> | null));
    });
    currentRow = 4 + sorted.length + 2;
  }

  ws.getCell(currentRow, 1).value = "Registros Suspeitos";
  ws.getCell(currentRow, 1).style = SECTION_STYLE;

  applyHeaderRow(ws, currentRow + 1, [
    "Atleta",
    "Equipe",
    "Checkpoint",
    "Data / Hora",
    "Problema",
  ]);

  const anomalies: {
    athlete: string;
    team: string;
    cp: string;
    time: string;
    issue: string;
  }[] = [];

  const seenIdentifiers = new Set<string>();

  for (const cp of data.checkpoints) {
    const athlete = cp.runner?.name ?? `#${cp.id_runner}`;
    const team = cp.runner?.team?.name ?? "-";

    if (cp.distance_km > 100) {
      anomalies.push({
        athlete,
        team,
        cp: cp.identifier,
        time: new Date(cp.created_at).toLocaleString("pt-BR"),
        issue: `Distância anormal: ${cp.distance_km} km`,
      });
    }

    const paceSec = getCheckpointPaceSeconds(cp);
    if (paceSec !== null && (paceSec > 600 || (paceSec < 60 && paceSec > 0))) {
      anomalies.push({
        athlete,
        team,
        cp: cp.identifier,
        time: new Date(cp.created_at).toLocaleString("pt-BR"),
        issue: `Pace anormal: ${formatPace(Math.round(paceSec))}/km`,
      });
    }

    if (!cp.pace && !cp.time) {
      anomalies.push({
        athlete,
        team,
        cp: cp.identifier,
        time: new Date(cp.created_at).toLocaleString("pt-BR"),
        issue: "Pace e tempo ausentes",
      });
    }

    if (seenIdentifiers.has(cp.identifier)) {
      anomalies.push({
        athlete,
        team,
        cp: cp.identifier,
        time: new Date(cp.created_at).toLocaleString("pt-BR"),
        issue: "Identificador duplicado",
      });
    }
    seenIdentifiers.add(cp.identifier);
  }

  if (anomalies.length === 0) {
    writeEmptyMessage(ws, currentRow + 2, "Nenhum registro suspeito encontrado.");
    return;
  }

  anomalies.forEach((a, i) => {
    const r = currentRow + 2 + i;
    applyCellStyle(ws, r, 1, a.athlete);
    applyCellStyle(ws, r, 2, a.team);
    applyCellStyle(ws, r, 3, a.cp);
    applyCellStyle(ws, r, 4, a.time);
    applyCellStyle(ws, r, 5, a.issue);
  });
}

export async function generateExcel(
  data: CompetitionExport,
  selectedSheets: SheetId[]
): Promise<ExcelJS.Buffer> {
  const wb = new ExcelJS.Workbook();

  const sheetBuilders: Record<
    string,
    (wb: ExcelJS.Workbook, data: CompetitionExport) => void
  > = {
    [SHEET_IDS.DASHBOARD]: buildSheetDashboard,
    [SHEET_IDS.EQUIPES]: buildSheetEquipes,
    [SHEET_IDS.ATLETAS]: buildSheetAtletas,
    [SHEET_IDS.OPERACAO]: buildSheetOperacao,
    [SHEET_IDS.AUDITORIA]: buildSheetAuditoria,
  };

  for (const sheetId of selectedSheets) {
    const builder = sheetBuilders[sheetId];
    if (builder) {
      builder(wb, data);
    }
  }

  return wb.xlsx.writeBuffer();
}

export { SHEET_IDS };
