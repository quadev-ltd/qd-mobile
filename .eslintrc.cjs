module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  ignorePatterns: ['*.js'],
  extends: [
    '@react-native',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:i18next/recommended'
  ],
  plugins: [
    'react-native'
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {}
    },
  },
  rules: {
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
    'import/no-default-export': 'error',
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'off',
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': 'error',
    'react-native/no-single-element-style-arrays': 'error',
    'eslint-comments/no-unlimited-disable': 'off',
    'no-console': [
      'error',
      {
        allow: ['info', 'error'],
      },
    ],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'no-restricted-imports': [
      'error',
      { name: 'react', importNames: ['default'] },
      { name: 'react-redux', importNames: ['useDispatch', 'useSelector'] },
      { name: 'react-native-config', importNames: ['Config'] },
    ],
    'i18next/no-literal-string': [
      'error',
      {
        mode: 'jsx-only',
        'jsx-attributes': {
          include: ['aria-label', 'title', 'alt', 'label', 'text', 'description', 'placeholder'],
        },
        'should-validate-template': true
      },
    ],
  },
  overrides: [
    {
      files: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
      plugins: ['jest'],
      extends: ['plugin:jest/recommended'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'i18next/no-literal-string': 'off',
      },
    },
  ],
};
