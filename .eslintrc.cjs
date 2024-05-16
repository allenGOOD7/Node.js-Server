/**
 * @type {import('eslint').Config}
 */
module.exports = {
  extends: [
    require.resolve('@pentium/common-config/eslint/eslint.base.config'),
    require.resolve('@pentium/common-config/eslint/eslint.react.config'),
    require.resolve('@pentium/common-config/eslint/eslint.typescript.config'),
    require.resolve('@pentium/common-config/eslint/eslint.prettier.config'),
  ],
  ignorePatterns: ['*.js', '*.d.ts'],
}
