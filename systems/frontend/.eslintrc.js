module.exports = {
  extends: ['@busybox'],
  overrides: [
    {
      extends: [
        'plugin:@angular-eslint/recommended',
        // This is required if you use inline templates in Components
        'plugin:@angular-eslint/template/process-inline-templates',
      ],
      files: ['*.ts'],
      parserOptions: {
        createDefaultProgram: true,
        project: ['tsconfig.app.json', 'tsconfig.spec.json'],
      },
    },
    {
      extends: ['plugin:@angular-eslint/template/recommended'],
      files: ['*.html'],
    },
  ],
  root: true,
  rules: {
    'dot-notation': 'off',
    'max-params': 'off',
  },
};
