const MANUAL_PREFIXES = ["MANUAL-", "CORRIGIDO-", "CORREÇÃO-", "REVISADO-"];

export type InputMethod = "manual" | "ocr" | "corrigido" | "desconhecido";

export function inferInputMethod(
  identifier: string | null | undefined,
  image?: Record<string, unknown> | null
): InputMethod {
  const imageMethod = image?.input_method;
  if (
    typeof imageMethod === "string" &&
    (imageMethod === "manual" || imageMethod === "ocr")
  ) {
    return imageMethod;
  }

  const id = (identifier ?? "").toUpperCase();

  if (id.startsWith("OCR-EDITED-")) return "corrigido";
  if (id.startsWith("OCR-")) return "ocr";
  if (id.startsWith("MANUAL-")) return "manual";
  if (id.startsWith("CORRIGIDO-") || id.startsWith("CORREÇÃO-") || id.startsWith("REVISADO-")) return "corrigido";

  return "desconhecido";
}

export function inferInputMethodLabel(
  identifier: string | null | undefined,
  image?: Record<string, unknown> | null
): string {
  const method = inferInputMethod(identifier, image);
  const labels: Record<InputMethod, string> = {
    manual: "Manual",
    ocr: "OCR",
    corrigido: "Corrigido",
    desconhecido: "Desconhecido",
  };
  return labels[method];
}
