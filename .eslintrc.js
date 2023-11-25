module.exports = {
  root: true,
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
    'react-hooks',
    'import',
    'jest',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'quotes': ['error', 'single', { 'allowTemplateLiterals': true }],
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'parent', 'sibling', 'index'],
      'newlines-between': 'always',
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }
    }],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'react-native/no-unused-styles': 2,
    'react-native/split-platform-components': 0,
    'react-native/no-inline-styles': 2,
    'react-native/no-color-literals': 2,
    'react-native/no-raw-text': 2,
    'react-native/no-single-element-style-arrays': 2,
    'eslint-comments/no-unlimited-disable': 0,
    'object-curly-spacing': ['error', 'always'],
    'template-curly-spacing': ['error', 'never'],
    'no-console': [
      'error',
      {
        allow: ['info', 'error'],
      },
    ],
    'prettier/prettier': 'off',
  },
};
