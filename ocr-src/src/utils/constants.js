export const FIELD_LABELS = {
  distance: "Distancia",
  time: "Tempo",
  speed: "Velocidade"
};

export const FIELD_UNITS = {
  distance: "km",
  time: "min:s",
  speed: "km/h"
};

export const PANEL_TEMPLATE = {
  distance: { x: 0.107, y: 0.433, w: 0.137, h: 0.121 },
  time: { x: 0.412, y: 0.413, w: 0.137, h: 0.121 },
  speed: { x: 0.728, y: 0.459, w: 0.125, h: 0.121 }
};

export const PANEL_VARIATION_LIMITS = {
  lighting: {
    minMeanRatio: 0.08,
    maxMeanRatio: 0.92
  },
  contrast: {
    minStdDevRatio: 0.06
  },
  size: {
    minPanelAreaRatio: 0.25,
    maxPanelAreaRatio: 1,
    minAspectRatio: 1.35,
    maxAspectRatio: 2.8
  },
  angle: {
    maxAbsDegrees: 6
  },
  sharpness: {
    resizeFactor: 3
  }
};

export const OCR_REGION_PADDING = {
  distance: { left: 0.22, right: 0.5, top: 0.02, bottom: 0.02 },
  time: { left: 0.22, right: 0.55, top: 0.06, bottom: 0.02 },
  speed: { left: 0.22, right: 0.28, top: 0.45, bottom: 0.08 }
};
