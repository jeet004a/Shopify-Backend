/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';

const config: Config = {
  preset:"ts-jest",
  clearMocks: true,
  verbose:true,
  collectCoverage: true,
  coveragePathIgnorePatterns:["/node_modules"],
  coverageDirectory: "coverage",
  moduleDirectories: ["node_modules", "src"],
};

export default config;
