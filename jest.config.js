const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  maxWorkers: 1,
  testTimeout: 30000,
  transform: {
    ...tsJestTransformCfg,
  },
};
