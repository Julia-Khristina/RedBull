export class ValidationService {
  normalize(field, value) {
    const cleaned = String(value || "")
      .replace(/[Oo]/g, "0")
      .replace(/[Ss]/g, "5")
      .replace(/[Il|]/g, "1")
      .replace(/\s+/g, "")
      .trim();

    if (["distance", "speed"].includes(field)) {
      const numberText = cleaned.replace(",", ".").replace(/[^0-9.]/g, "");

      if (!numberText.includes(".") && field === "distance" && /^\d{2}$/.test(numberText)) {
        return `0.${numberText}`;
      }

      if (!numberText.includes(".") && field === "speed" && /^0\d$/.test(numberText)) {
        return `0.${numberText.slice(1)}`;
      }

      if (!numberText.includes(".") && /^0\d{2,}$/.test(numberText)) {
        return `0.${numberText.slice(1)}`;
      }

      if (!numberText.includes(".") && /^\d{3}$/.test(numberText)) {
        return field === "speed"
          ? `${numberText.slice(0, 2)}.${numberText.slice(2)}`
          : `${numberText.slice(0, 1)}.${numberText.slice(1)}`;
      }

      if (!numberText.includes(".") && /^\d{4}$/.test(numberText)) {
        return `${numberText.slice(0, 2)}.${numberText.slice(2)}`;
      }

      return numberText;
    }

    if (field === "time") {
      const timeText = cleaned.replace(/[^0-9:]/g, "");

      if (!timeText.includes(":") && /^\d{3}$/.test(timeText)) {
        return `${timeText.slice(0, 1)}:${timeText.slice(1)}`;
      }

      if (!timeText.includes(":") && /^\d{4}$/.test(timeText)) {
        return `${timeText.slice(0, 2)}:${timeText.slice(2)}`;
      }

      return timeText;
    }

    return cleaned;
  }

  validate(field, value) {
    const normalized = this.normalize(field, value);
    const result = { value: normalized, valid: true, message: "" };

    if (!normalized) {
      return { value: normalized, valid: false, message: "Valor vazio" };
    }

    if (["distance", "speed"].includes(field)) {
      const number = Number(normalized);
      result.valid = Number.isFinite(number) && number > 0 && number < (field === "speed" ? 30 : 100);
      result.message = result.valid ? "" : "Numero fora do intervalo esperado";
      return result;
    }

    if (field === "time") {
      result.valid = /^(\d{1,3}:)?\d{1,2}:\d{2}$/.test(normalized) || /^\d{1,3}:\d{2}$/.test(normalized);
      result.message = result.valid ? "" : "Formato esperado: mm:ss";
      return result;
    }

    return result;
  }

  validateAll(rawOcr) {
    const validation = {};

    Object.entries(rawOcr).forEach(([field, value]) => {
      validation[field] = this.validate(field, value);
    });

    return validation;
  }
}
