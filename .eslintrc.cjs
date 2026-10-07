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
      typescript: {
        alwaysTryTypes: true,
      },
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
    'import/no-named-as-default': 'off',
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'off',
    'react-native/no-inline-styles': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-raw-text': 'error',
    'react-native/no-single-element-style-arrays': 'error',
    'eslint-comments/no-unlimited-disable': 'off',
    'react/prop-types': 'off',
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
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    'no-restricted-imports': [
      'error',
      { name: 'react', importNames: ['default'] },
      { name: 'react-redux', importNames: ['useDispatch', 'useSelector'] },
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
      // Configuration is read once, in src/core/env.ts (validated with zod).
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      excludedFiles: ['src/core/env.ts'],
      rules: {
        'no-restricted-properties': [
          'error',
          {
            object: 'process',
            property: 'env',
            message: 'Read configuration through src/core/env.ts.',
          },
        ],
      },
    },
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
