import js from '@eslint/js'
import globals from 'globals'

import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,

      reactRefresh.configs.vite,
    ],
    rules: { "@typescript-eslint/no-unused-vars": "off", "react-refresh/only-export-components": "off", "@typescript-eslint/no-explicit-any": "off" }, languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
