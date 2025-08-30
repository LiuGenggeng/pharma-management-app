module.exports = {
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_', // 忽略以下划线开头的参数
        varsIgnorePattern: '^_'  // 忽略以下划线开头的变量
      }
    ]
  }
};