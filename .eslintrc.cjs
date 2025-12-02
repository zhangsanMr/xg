module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    // Vue 规则
    'vue/multi-word-component-names': 'off',
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/custom-event-name-casing': ['error', 'kebab-case'],
    'vue/no-unused-vars': 'error',
    'vue/no-v-html': 'warn',
    'vue/padding-line-between-blocks': ['error', 'always'],
    
    // TypeScript 规则
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/no-non-null-assertion': 'warn',
    
    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': 'off', // 由 @typescript-eslint/no-unused-vars 处理
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'quote-props': ['error', 'as-needed'],
    
    // 代码风格
    'semi': ['error', 'never'],
    'quotes': ['error', 'single', { avoidEscape: true }],
    'comma-dangle': ['error', 'only-multiline'],
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'all'],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        'indent': 'off',
      },
    },
  ],
}
