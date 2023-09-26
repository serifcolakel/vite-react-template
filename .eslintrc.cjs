module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: { jsx: true },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/jsx-props-no-spreading': 'off',
    'max-len': [
      // ? https://eslint.org/docs/rules/max-len
      'error',
      {
        code: 150,
      },
    ],
    'padding-line-between-statements': [
      // ? https://eslint.org/docs/latest/rules/padding-line-between-statements
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'function'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: ['*'],
        next: ['if', 'switch', 'while', 'try', 'function'],
      },
      {
        blankLine: 'always',
        prev: ['if', 'switch', 'while', 'try', 'function'],
        next: ['*'],
      },
      {
        blankLine: 'always',
        prev: ['export'],
        next: ['*'],
      },
    ],
    'import/prefer-default-export': 'off',
    'no-console': 'error',
    'react/jsx-sort-props': [
      // ? https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
      'error',
      {
        shorthandFirst: true,
      },
    ],
    'react/require-default-props': ['off'],
    'no-else-return': 'error',
    // ? https://eslint.org/docs/rules/no-else-return
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
}
