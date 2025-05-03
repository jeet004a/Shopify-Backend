"use strict";
/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: "ts-jest",
    clearMocks: true,
    verbose: true,
    collectCoverage: true,
    coveragePathIgnorePatterns: ["/node_modules"],
    coverageDirectory: "coverage",
    moduleDirectories: ["node_modules", "src"],
};
exports.default = config;
