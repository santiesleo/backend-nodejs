module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    // TypeScript rules
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'error',
    
    // General rules
    'no-console': 'warn',
    'no-unused-vars': 'off',
    'prefer-const': 'error',
    'no-var': 'error',
    'no-useless-catch': 'error',
  },
  env: {
    node: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    '*.js',
    '*.d.ts',
  ],
};