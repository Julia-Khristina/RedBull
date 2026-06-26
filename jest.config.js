const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    "src/helpers/asyncHandler.ts",
    "src/routes/adminRoutes.ts",
    "src/routes/checkpointRoutes.ts",
    "src/routes/exportRoutes.ts",
    "src/routes/ocrRoutes.ts",
    "src/routes/rankingRoutes.ts",
    "src/routes/reportRoutes.ts",
    "src/routes/runnerRoutes.ts",
    "src/routes/teamRoutes.ts",
    "src/routes/tvPanelRoutes.ts",
    "src/services/adminService.ts",
    "src/services/teamService.ts",
  ],
  coverageReporters: ["text", "lcov"],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  maxWorkers: 1,
  testTimeout: 30000,
  transform: {
    ...tsJestTransformCfg,
  },
};
