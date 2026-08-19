import eslint from '@eslint/js'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  { ignores: ['dist/**', 'coverage/**', 'auto-imports.d.ts', 'components.d.ts'] },
  eslint.configs.recommended,
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        parserOptions: {
          ecmaFeatures: { jsx: true },
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
    },
  },
  skipFormatting,
)
