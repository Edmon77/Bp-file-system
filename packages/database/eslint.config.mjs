import { config as baseConfig } from '@eeu/eslint-config/base';
import tsParser from '@typescript-eslint/parser';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  ...baseConfig,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
      },
    },
  },
];
